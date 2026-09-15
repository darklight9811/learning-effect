import { AsyncLocalStorage } from "node:async_hooks";
import { existsSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { PGlite } from "@electric-sql/pglite";
import type { PgliteDatabase } from "drizzle-orm/pglite";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres, { type Sql } from "postgres";
import { config } from "@/config";
import { dbSchema } from "./schema";

export function isPgliteCorruptionError(error: unknown) {
	const message = error instanceof Error ? error.message : String(error);

	return (
		message.includes("unexpected data beyond EOF") ||
		message.includes("ExtendBufferedRelShared") ||
		message.includes("bufmgr.c") ||
		message.includes("corruption") ||
		message.includes("database disk image is malformed")
	);
}

export function resetCorruptedPgliteDataDir(dirPath: string) {
	if (!existsSync(dirPath)) return false;

	try {
		rmSync(dirPath, { recursive: true, force: true });
		return true;
	} catch {
		return false;
	}
}

const loadDrizzleModule = async (
	specifier: "drizzle-orm/pglite" | "drizzle-orm/postgres-js",
) => {
	const mod = (await import(/* @vite-ignore */ specifier)) as {
		drizzle: (client: any, config?: any) => any;
	};

	return mod.drizzle;
};

let drizzlePGLite:
	| ((client: PGlite, config: { schema: typeof dbSchema }) => any)
	| undefined;
let drizzlePostgres:
	| ((client: Sql, config: { schema: typeof dbSchema }) => any)
	| undefined;

const ensureDrizzleAdapters = async () => {
	if (drizzlePGLite && drizzlePostgres) return;

	[drizzlePGLite, drizzlePostgres] = await Promise.all([
		loadDrizzleModule("drizzle-orm/pglite"),
		loadDrizzleModule("drizzle-orm/postgres-js"),
	]);
};

let usingPGLite = false;

const pgliteDataDir = resolve(process.cwd(), ".pglite");

let client: Sql | PGlite | undefined;
let dbInitPromise: Promise<Database> | undefined;

const createClient = (): Sql | PGlite => {
	if (config.database) {
		usingPGLite = false;
		return postgres(config.database, {
			prepare: false,
		});
	}

	if (config.type === "prod" || process.env.NODE_ENV === "production") {
		throw new Error(
			"[db] DATABASE_URL is required in production. PGLite is disabled in production.",
		);
	}

	usingPGLite = true;
	console.info(
		`[db] Using PGLite (filesystem database at ${pgliteDataDir}) - DATABASE_URL not set`,
	);
	return new PGlite(pgliteDataDir);
};

const createDb = async () => {
	await ensureDrizzleAdapters();
	client = createClient();

	if (usingPGLite && drizzlePGLite) {
		const pgliteDb = drizzlePGLite(client as PGlite, {
			schema: dbSchema,
		});

		initializePGLiteMigrations(pgliteDb);
		return pgliteDb;
	}

	return drizzlePostgres!(client as Sql, {
		schema: dbSchema,
	});
};

// Ensure PGLite is initialized with migrations before use
let migrationPromise: Promise<void> | undefined;

const ensureMigrationsRun = async () => {
	if (!usingPGLite || !migrationPromise) return;
	await migrationPromise;
};

const initializePGLiteMigrations = (
	pgliteDb: PgliteDatabase<typeof dbSchema>,
) => {
	if (!usingPGLite) return;

	if (process.env.VITEST === "true" || process.env.NODE_ENV === "test") {
		migrationPromise = Promise.resolve();
		return;
	}

	migrationPromise = (async () => {
		const originalWrite = process.stdout.write.bind(
			process.stdout,
		) as typeof process.stdout.write;
		process.stdout.write = (() => true) as typeof process.stdout.write;

		try {
			const { pushSchema } = (await import(
				/* @vite-ignore */ "drizzle-kit/api"
			)) as unknown as {
				pushSchema: (
					schema: typeof dbSchema,
					db: PgliteDatabase<typeof dbSchema>,
				) => {
					apply: () => Promise<void>;
				};
			};
			const { apply } = await pushSchema(dbSchema, pgliteDb as never);
			await apply();
			console.info("[db] PGLite schema sync completed");
		} catch (err) {
			if (isPgliteCorruptionError(err)) {
				console.warn(
					"[db] PGLite data directory was corrupted; resetting local test database.",
				);
				resetCorruptedPgliteDataDir(pgliteDataDir);
				return;
			}
			console.error("[db] Error running PGLite schema sync:", err);
			throw err;
		} finally {
			process.stdout.write = originalWrite;
		}
	})();
};

declare global {
	var dbClient:
		| PostgresJsDatabase<typeof dbSchema>
		| PgliteDatabase<typeof dbSchema>
		| undefined;
}

type Database =
	| PostgresJsDatabase<typeof dbSchema>
	| PgliteDatabase<typeof dbSchema>;

let db!: Database;

export async function ensureDbInitialized(): Promise<Database> {
	if (db) return db;
	if (globalThis.dbClient) {
		db = globalThis.dbClient;
		return db;
	}
	if (dbInitPromise) return dbInitPromise;

	dbInitPromise = (async () => {
		const initializedDb = await createDb();
		if (process.env.NODE_ENV !== "production")
			globalThis.dbClient = initializedDb;
		db = initializedDb;
		return initializedDb;
	})();

	return dbInitPromise;
}

if (process.env.NODE_ENV === "production") {
	db = await createDb();
} else {
	db = await ensureDbInitialized();
}

async function reconnect() {
	try {
		if (client) {
			try {
				// gracefully close existing client
				if (typeof (client as any).end === "function") {
					await (client as Sql).end();
				} else if (typeof (client as any).close === "function") {
					// PGlite uses close() instead of end()
					await (client as any).close();
				}
			} catch {}
		}
	} finally {
		// recreate and replace global/db
		dbInitPromise = (async () => {
			const newDb = await createDb();
			if (process.env.NODE_ENV !== "production") globalThis.dbClient = newDb;
			db = newDb;
			return newDb;
		})();
		await dbInitPromise;
	}
}

export const dbStorage = new AsyncLocalStorage<typeof db>();
export const isUsingPGLite = () => usingPGLite;
export { ensureMigrationsRun };

function getDB() {
	return dbStorage.getStore() ?? db;
}

function dbTransaction<T>(callback: (db: Database) => Promise<T>) {
	return db.transaction(async (tx: any) => {
		return dbStorage.run(tx, async () => {
			return callback(tx);
		});
	});
}

export { db, dbTransaction, getDB, reconnect };

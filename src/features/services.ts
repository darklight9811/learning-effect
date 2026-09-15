import { Layer } from "effect";
import { PostgresStorage } from "@/modules/database/postgres.storage";
import { dbTaskStorage } from "./tasks/infra/storage/db.storage";
import { memoryUserStorage } from "./users/infra/storage/memory.storage";

export const AppServices = Layer.mergeAll(
	Layer.provide(dbTaskStorage, PostgresStorage),
	memoryUserStorage,
);

export type AppServicesType = Layer.Success<typeof AppServices>;

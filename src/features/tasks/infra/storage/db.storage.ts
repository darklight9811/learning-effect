import { eq } from "drizzle-orm";
import { Effect, Layer } from "effect";
import { DB } from "@/modules/database";
import { tasksTable } from "../../domain/table";
import { TaskStorage } from "../storage.interface";

export const dbTaskStorage = Layer.effect(
	TaskStorage,
	Effect.gen(function* () {
		const db = yield* DB;

		return {
			index() {
				return Effect.promise(() => db.select().from(tasksTable));
			},
			show(id) {
				return Effect.promise(() =>
					db
						.select()
						.from(tasksTable)
						.where(eq(tasksTable.id, id))
						.limit(1)
						.then((rows) => rows[0]),
				);
			},
			create(task) {
				return Effect.promise(() =>
					db
						.insert(tasksTable)
						.values(task)
						.then(() => undefined),
				);
			},
			update(id, task) {
				return Effect.promise(() =>
					db
						.update(tasksTable)
						.set(task)
						.where(eq(tasksTable.id, id))
						.then(() => undefined),
				);
			},
			delete(id) {
				return Effect.promise(() =>
					db
						.delete(tasksTable)
						.where(eq(tasksTable.id, id))
						.then(() => undefined),
				);
			},
		};
	}),
);

import { Effect, Layer } from "effect";
import type { taskSchema } from "../../schema";
import { TaskStorage } from "../storage.interface";

const storage = [] as (typeof taskSchema.infer)[];

export const memoryTaskStorage = Layer.effect(
	TaskStorage,
	Effect.gen(function* () {
		return {
			index() {
				return Effect.succeed(storage);
			},
			show(id) {
				return Effect.succeed(storage.find((task) => task.id === id) || null);
			},
			create(task) {
				storage.push(task);
				return Effect.succeed(undefined);
			},
			update(id, task) {
				const index = storage.findIndex((t) => t.id === id);
				if (index !== -1) {
					storage[index] = task;
				}
				return Effect.succeed(undefined);
			},
			delete(id) {
				const index = storage.findIndex((t) => t.id === id);
				if (index !== -1) {
					storage.splice(index, 1);
				}
				return Effect.succeed(undefined);
			},
		};
	}),
);

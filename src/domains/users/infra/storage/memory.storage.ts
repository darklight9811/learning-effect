import { Effect, Layer } from "effect";
import type { userSchema } from "../../schema";
import { UserStorage } from "../storage.interface";

const storage = [] as (typeof userSchema.infer)[];

export const memoryUserStorage = Layer.effect(
	UserStorage,
	Effect.gen(function* () {
		return {
			index() {
				return Effect.succeed(storage);
			},
			show(id) {
				return Effect.succeed(storage.find((user) => user.id === id) || null);
			},
			create(user) {
				storage.push(user);
				return Effect.succeed(undefined);
			},
			update(id, user) {
				const index = storage.findIndex((t) => t.id === id);
				if (index !== -1) {
					storage[index] = user;
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

import { Effect } from "effect";
import { TaskStorage } from "../infra/storage.interface";

export const listTasksUseCase = () =>
	Effect.gen(function* () {
		const storage = yield* TaskStorage;
		const tasks = yield* storage.index();

		return tasks;
	});

import { Effect } from "effect";
import { AppError } from "@/modules/errors/app-error";
import { TaskStorage } from "../infra/storage.interface";

export const indexTasksUseCase = () =>
	Effect.gen(function* () {
		const storage = yield* TaskStorage;
		const tasks = yield* storage.index();

		if (!tasks) return yield* AppError.notFound();

		return tasks;
	});

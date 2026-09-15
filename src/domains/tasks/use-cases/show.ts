import { Effect } from "effect";
import { AppError } from "@/modules/errors/app-error";
import { TaskStorage } from "../infra/storage.interface";

export const showTaskUseCase = (id: string) =>
	Effect.gen(function* () {
		const storage = yield* TaskStorage;
		const task = yield* storage.show(id);

		if (!task) return yield* AppError.notFound();

		return task;
	});

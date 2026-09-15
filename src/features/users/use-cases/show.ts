import { Effect } from "effect";
import { AppError } from "@/modules/errors/app-error";
import { UserStorage } from "../infra/storage.interface";

export const showUserUseCase = (id: string) =>
	Effect.gen(function* () {
		const storage = yield* UserStorage;
		const user = yield* storage.show(id);

		if (!user) return yield* AppError.notFound();

		return user;
	});

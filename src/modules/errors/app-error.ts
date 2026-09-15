import { Data, Effect } from "effect";

export class AppError extends Data.TaggedError("AppError")<{
	readonly status: number;
	readonly code: string;
	readonly message?: string;
}> {
	static unauthorized(message?: string) {
		return Effect.fail(
			new AppError({
				status: 401,
				code: "unauthorized",
				message,
			}),
		);
	}

	static notFound(message?: string) {
		return Effect.fail(
			new AppError({
				status: 404,
				code: "not_found",
				message,
			}),
		);
	}
}

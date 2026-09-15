import { Effect, Layer } from "effect";

import { memoryTaskStorage } from "./tasks/infra/storage/memory.storage";
import { memoryUserStorage } from "./users/infra/storage/memory.storage";

export const servicesProvider = Layer.merge(
	memoryTaskStorage,
	memoryUserStorage,
);

type AppServices = Layer.Success<typeof servicesProvider>;

export const program = <
	Eff extends Effect.Effect<unknown, unknown, AppServices>,
>(
	eff: Eff,
): Promise<Effect.Success<Eff>> =>
	Effect.runPromise(
		Effect.provide(eff, servicesProvider) as Effect.Effect<
			Effect.Success<Eff>,
			Effect.Error<Eff>,
			never
		>,
	);

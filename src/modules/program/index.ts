import { Effect } from "effect";

import { AppServices, type AppServicesType } from "@/domains/services";

export const program = <
	Eff extends Effect.Effect<unknown, unknown, AppServicesType>,
>(
	eff: Eff,
): Promise<Effect.Success<Eff>> =>
	Effect.runPromise(
		Effect.provide(eff, AppServices) as Effect.Effect<
			Effect.Success<Eff>,
			Effect.Error<Eff>,
			never
		>,
	);

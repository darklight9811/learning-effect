import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { servicesProvider } from "@/domains/services";
import { getTaskUseCase } from "../../service/get-task";

export const getTask = createServerFn().handler(() => {
	return Effect.runPromise(
		Effect.provide(getTaskUseCase("asd"), servicesProvider),
	);
});

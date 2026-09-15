import { createServerFn } from "@tanstack/react-start";
import { type } from "arktype";
import { program } from "@/domains/services";
import { showTaskUseCase } from "../../use-cases/show-task";

export const showTask = createServerFn()
	.validator(type("string"))
	.handler(({ data }) => program(showTaskUseCase(data)));

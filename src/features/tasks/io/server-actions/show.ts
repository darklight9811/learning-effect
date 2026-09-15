import { createServerFn } from "@tanstack/react-start";
import { type } from "arktype";
import { program } from "@/modules/program";
import { showTaskUseCase } from "../../use-cases/show";

export const showTask = createServerFn()
	.validator(type("string"))
	.handler(({ data }) => program(showTaskUseCase(data)));

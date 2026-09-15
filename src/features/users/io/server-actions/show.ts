import { createServerFn } from "@tanstack/react-start";
import { type } from "arktype";
import { program } from "@/modules/program";
import { showUserUseCase } from "../../use-cases/show";

export const showUser = createServerFn()
	.validator(type("string"))
	.handler(({ data }) => program(showUserUseCase(data)));

import { createServerFn } from "@tanstack/react-start";
import { type } from "arktype";
import { program } from "@/modules/program";
import { getUserUseCase } from "../../service/get-user";

export const getUser = createServerFn()
	.validator(type("string"))
	.handler(({ data }) => program(getUserUseCase(data)));

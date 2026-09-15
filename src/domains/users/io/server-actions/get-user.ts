import { createServerFn } from "@tanstack/react-start";
import { type } from "arktype";
import { program } from "@/domains/services";
import { getUserUseCase } from "../../service/get-user";

export const getUser = createServerFn()
	.validator(type("string"))
	.handler(({ data }) => program(getUserUseCase(data)));

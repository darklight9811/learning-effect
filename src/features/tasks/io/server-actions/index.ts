import { createServerFn } from "@tanstack/react-start";
import { program } from "@/modules/program";
import { indexTasksUseCase } from "../../use-cases";

export const indexTasks = createServerFn().handler(() =>
	program(indexTasksUseCase()),
);

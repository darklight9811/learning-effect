import { createServerFn } from "@tanstack/react-start";
import { program } from "@/modules/program";
import { indexTasksUseCase } from "../../use-cases/index-tasks";

export const indexTasks = createServerFn().handler(() =>
	program(indexTasksUseCase()),
);

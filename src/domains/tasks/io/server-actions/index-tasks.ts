import { createServerFn } from "@tanstack/react-start";
import { program } from "@/domains/services";
import { indexTasksUseCase } from "../../use-cases/index-tasks";

export const indexTasks = createServerFn().handler(() =>
	program(indexTasksUseCase()),
);

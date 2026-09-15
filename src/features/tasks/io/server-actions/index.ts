import { createServerFn } from "@tanstack/react-start";
import { program } from "@/modules/program";
import { indexTasksUseCase } from "../../app";

export const indexTasks = createServerFn().handler(() =>
	program(indexTasksUseCase()),
);

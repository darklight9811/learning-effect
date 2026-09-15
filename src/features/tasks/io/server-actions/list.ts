import { createServerFn } from "@tanstack/react-start";
import { program } from "@/modules/program";
import { listTasksUseCase } from "../../app/list";

export const listTasks = createServerFn().handler(() =>
	program(listTasksUseCase()),
);

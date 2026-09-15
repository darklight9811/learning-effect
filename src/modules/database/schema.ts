import { tasksTable } from "@/features/tasks/domain/table";

export const dbSchema = {
	tasksTable,
};

export type DbSchema = typeof dbSchema;

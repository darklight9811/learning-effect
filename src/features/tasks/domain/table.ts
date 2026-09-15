import { c } from "@/modules/database/columns";

export const tasksTable = c.table("tasks", {
	id: c.id().defaultRandom().primaryKey(),
});

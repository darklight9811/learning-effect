import { queryOptions } from "@tanstack/react-query";
import { listTasks } from "../server-actions/list";

export const listQueryOptions = () =>
	queryOptions({
		queryKey: ["tasks", "index"],
		queryFn: () => listTasks(),
	});

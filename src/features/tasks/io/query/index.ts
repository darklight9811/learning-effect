import { queryOptions } from "@tanstack/react-query";
import { indexTasks } from "../server-actions";

export const indexQueryOptions = () =>
	queryOptions({
		queryKey: ["tasks", "index"],
		queryFn: () => indexTasks(),
	});

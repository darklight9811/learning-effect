import { useQuery } from "@tanstack/react-query";
import { indexTasks } from "../server-actions";

export const useIndexTasks = () => {
	return useQuery({
		queryKey: ["tasks", "index"],
		queryFn: () => indexTasks(),
	});
};

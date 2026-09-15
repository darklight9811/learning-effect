import { useQuery } from "@tanstack/react-query";
import { listQueryOptions } from "../query/list";

export const useListTasks = () => {
	return useQuery(listQueryOptions());
};

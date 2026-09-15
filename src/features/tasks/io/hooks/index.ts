import { useQuery } from "@tanstack/react-query";
import { indexQueryOptions } from "../query";

export const useIndexTasks = () => {
	return useQuery(indexQueryOptions());
};

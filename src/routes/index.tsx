import { createFileRoute } from "@tanstack/react-router";
import { useIndexTasks } from "@/domains/tasks/io/hooks";
import { indexQueryOptions } from "@/domains/tasks/io/query";

export const Route = createFileRoute("/")({
	component: Home,
	loader({ context }) {
		return Promise.all([context.queryClient.query(indexQueryOptions())]);
	},
});

function Home() {
	const { data } = useIndexTasks();

	return (
		<div className="p-8">
			<h1 className="text-4xl font-bold">Welcome to TanStack Start</h1>
			<pre>{JSON.stringify(data, null, 4)}</pre>
		</div>
	);
}

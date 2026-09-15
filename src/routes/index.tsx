import { createFileRoute } from "@tanstack/react-router";
import { useListTasks } from "@/features/tasks/io/hooks/list";
import { listQueryOptions } from "@/features/tasks/io/query/list";

export const Route = createFileRoute("/")({
	component: Home,
	loader({ context }) {
		return Promise.all([context.queryClient.query(listQueryOptions())]);
	},
});

function Home() {
	const { data } = useListTasks();

	return (
		<div className="p-8">
			<h1 className="text-4xl font-bold">Welcome to TanStack Start</h1>
			<pre>{JSON.stringify(data, null, 4)}</pre>
		</div>
	);
}

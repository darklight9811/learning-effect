import { createFileRoute } from "@tanstack/react-router";
import { indexTasks } from "@/domains/tasks/io/server-actions/index-tasks";

export const Route = createFileRoute("/")({
	component: Home,
	loader: () => indexTasks(),
});

function Home() {
	const data = Route.useLoaderData();

	return (
		<div className="p-8">
			<h1 className="text-4xl font-bold">Welcome to TanStack Start</h1>
			<pre>{JSON.stringify(data, null, 4)}</pre>
		</div>
	);
}

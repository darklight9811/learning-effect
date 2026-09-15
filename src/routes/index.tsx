import { createFileRoute } from "@tanstack/react-router";
import { getTask } from "@/domains/tasks/io/server-actions/get-task";

export const Route = createFileRoute("/")({
	component: Home,
	loader: () => getTask({ data: "some-task-id" }),
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

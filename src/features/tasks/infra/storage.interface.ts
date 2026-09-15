import { Context, type Effect } from "effect";
import type { taskSchema } from "../domain/schema";

export class TaskStorage extends Context.Service<
	TaskStorage,
	{
		index: () => Effect.Effect<(typeof taskSchema.infer)[]>;
		show: (id: string) => Effect.Effect<typeof taskSchema.infer | null>;
		create: (task: typeof taskSchema.infer) => Effect.Effect<void>;
		update: (id: string, task: typeof taskSchema.infer) => Effect.Effect<void>;
		delete: (id: string) => Effect.Effect<void>;
	}
>()("TaskStorage") {}

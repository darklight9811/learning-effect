import { Context, type Effect } from "effect";
import type { userSchema } from "../schema";

export class UserStorage extends Context.Service<
	UserStorage,
	{
		index: () => Effect.Effect<(typeof userSchema.infer)[]>;
		show: (id: string) => Effect.Effect<typeof userSchema.infer | null>;
		create: (user: typeof userSchema.infer) => Effect.Effect<void>;
		update: (id: string, user: typeof userSchema.infer) => Effect.Effect<void>;
		delete: (id: string) => Effect.Effect<void>;
	}
>()("UserStorage") {}

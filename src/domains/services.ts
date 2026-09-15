import { Layer } from "effect";

import { memoryTaskStorage } from "./tasks/infra/storage/memory.storage";
import { memoryUserStorage } from "./users/infra/storage/memory.storage";

export const servicesProvider = Layer.merge(
	memoryTaskStorage,
	memoryUserStorage,
);

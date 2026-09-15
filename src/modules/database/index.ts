import { Context } from "effect";
import type { getDB } from "./helpers";

export class DB extends Context.Service<DB, ReturnType<typeof getDB>>()("DB") {}

import { Effect, Layer } from "effect";
import { DB } from ".";
import { getDB } from "./helpers";

export const PostgresStorage = Layer.effect(DB, Effect.sync(getDB));

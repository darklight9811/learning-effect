import { Config } from "effect";

export const config = Config.all({
	database: Config.String("DATABASE_URL"),
});

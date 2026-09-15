import { defineConfig } from "drizzle-kit";

export default defineConfig({
	out: "./drizzle",
	schema: ["./src/features/*/domain/table.ts"],
	dialect: "postgresql",
	dbCredentials: {
		url: import.meta.env.DATABASE_URL || process.env.DATABASE_URL,
	},
	extensionsFilters: ["postgis"],
	tablesFilter: ["*", "!pg_stat_statements*"],
	verbose: true,
});

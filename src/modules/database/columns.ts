import { cuid2 } from "drizzle-cuid2/postgres";
import { relations } from "drizzle-orm";
import {
	bigint,
	boolean,
	integer,
	jsonb,
	pgEnum,
	pgTableCreator,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";

export const table = pgTableCreator((n) => n);

export const c = {
	table,
	id: (id = "id") => cuid2(id).setLength(32),
	varchar,
	text,
	boolean,
	timestamp,
	enum: pgEnum,
	json: jsonb,
	int: integer,
	bigint,
	relations,
};

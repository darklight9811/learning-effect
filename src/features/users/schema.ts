import { type } from "arktype";

export const userSchema = type({
	id: "string",
	name: "string",
	email: "string",
});

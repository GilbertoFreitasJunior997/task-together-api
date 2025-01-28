import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { usersTable } from "../database/tables";

export const userSchema = createSelectSchema(usersTable);
export type User = z.infer<typeof userSchema>;

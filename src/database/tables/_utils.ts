import { timestamp, uuid } from "drizzle-orm/pg-core";

export const id = (name = "id") => uuid(name).primaryKey().defaultRandom();

export const createdAt = (name = "created_at") =>
  timestamp(name).defaultNow().notNull();

export const updatedAt = (name = "updated_at") =>
  timestamp(name).defaultNow().notNull();

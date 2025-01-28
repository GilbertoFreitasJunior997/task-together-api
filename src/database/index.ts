import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { env } from "../lib/env";
import * as schema from "./tables";

const pool = new pg.Pool({
  connectionString: env.DATABASE_CONNECTION_STRING,
});

export const db = drizzle({ client: pool, schema });

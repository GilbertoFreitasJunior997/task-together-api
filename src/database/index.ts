import { env } from "@/lib/env";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./tables";

const pool = new Pool({
  connectionString: env.DATABASE_CONNECTION_STRING,
});

export const db = drizzle({ client: pool, schema });

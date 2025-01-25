import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const connectionString = process.env.DATABASE_CONNECTION_STRING;

if (!connectionString) {
  throw new Error("Please provide a connection string");
}

export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: connectionString,
  },
  schema: "./src/database/tables/*",
  out: "./src/database/migrations",
});

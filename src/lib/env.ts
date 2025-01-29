import { z } from "zod";

export const envSchema = z.object({
  PORT: z.string(),
  DATABASE_CONNECTION_STRING: z.string(),
  CLIENT_URL: z.string(),
  TOKEN_SECRET: z.string(),
  GOOGLE_AUTH_CLIENT_ID: z.string(),
  GOOGLE_AUTH_CLIENT_SECRET: z.string(),
  GOOGLE_REDIRECT_URI: z.string(),
});
export type Env = z.infer<typeof envSchema>;

let env: Env;
try {
  env = envSchema.parse(process.env);
} catch (error) {
  throw new Error(
    "Please provide the correct env vars as described in .env.example",
    {
      cause: error,
    },
  );
}

export { env };

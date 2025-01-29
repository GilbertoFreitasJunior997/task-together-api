import * as trpcExpress from "@trpc/server/adapters/express";
import express from "express";
import { env } from "./lib/env";
import { createContext } from "./trpc/context";
import { appRouter } from "./trpc/router";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { cors } from "./lib/cors";
import { googleAuthRouter } from "./routers/auth/auth.router";

const app = express();

app.use(cors());
app.use(cookieParser());

app.use("/auth/google", googleAuthRouter);

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

app.listen(env.PORT, () => {
  console.info(`Listening on port ${env.PORT}`);
});

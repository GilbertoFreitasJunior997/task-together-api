import * as trpcExpress from "@trpc/server/adapters/express";
import express from "express";
import { env } from "./lib/env";
import { createContext } from "./trpc/context";
import { appRouter } from "./trpc/router";
import 'dotenv/config'

const app = express();

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

app.listen(env.PORT);

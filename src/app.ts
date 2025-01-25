import * as trpcExpress from "@trpc/server/adapters/express";
import express from "express";
import { env } from "./lib/env";
import { createContext } from "./trpc/context";
import { appRouter } from "./trpc/router";
import "dotenv/config";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (origin && origin !== env.CLIENT_URL) {
        return callback(new Error("Not allowed by CORS"));
      }

      return callback(null, true);
    },
  }),
);

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

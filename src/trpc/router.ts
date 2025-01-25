import { initTRPC } from "@trpc/server";
import { Context } from "./context";

const t = initTRPC.context<Context>().create();
export const publicProcedure = t.procedure;

export const appRouter = t.router({
  get: publicProcedure.query(() => ({ message: "Hello" })),
});

import { trpc } from ".";
import { authRouter } from "../routers/auth/auth.router";
import { authProcedure } from "./procedures";

export const appRouter = trpc.router({
  auth: authRouter,
  other: authProcedure.query(() => {
    return { data: "Hi!" };
  }),
});

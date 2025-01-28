import { trpc } from ".";
import { authMiddleware } from "../routers/auth/auth.middleware";

export const publicProcedure = trpc.procedure;
export const authProcedure = trpc.procedure.use(authMiddleware);

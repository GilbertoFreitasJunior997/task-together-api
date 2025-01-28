import { getUserFromCookies } from "../../lib/jwt";
import { trpc } from "../../trpc";

export const authMiddleware = trpc.middleware(async ({ next, ctx }) => {
  const user = getUserFromCookies(ctx.req.cookies);

  return next({
    ctx: {
      ...ctx,
      user,
    },
  });
});

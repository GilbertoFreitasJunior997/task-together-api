import { Router } from "express";
import { authSignInInputSchema } from "../../schemas/auth.schemas";
import { trpc } from "../../trpc";
import { publicProcedure } from "../../trpc/procedures";
import { authService } from "./auth.service";

export const authRouter = trpc.router({
  signUp: publicProcedure
    .input(authSignInInputSchema)
    .mutation(({ input, ctx }) => authService.signUp(input, ctx.res)),

  signIn: publicProcedure
    .input(authSignInInputSchema)
    .mutation(({ input, ctx }) => authService.signIn(input, ctx.res)),
});

export const googleAuthRouter = Router()
  .get("", async (_req, res) => {
    const url = await authService.generateGoogleAuthUrl();

    res.redirect(url);
  })
  .get("/callback", authService.signInWithGoogle);

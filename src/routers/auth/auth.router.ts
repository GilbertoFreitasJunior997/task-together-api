import { app } from "../../app";
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

app.get("/auth/google", authService.generateGoogleAuthUrl);

app.get("/auth/google/callback", authService.signInWithGoogle);

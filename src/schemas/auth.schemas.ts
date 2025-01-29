import { z } from "zod";
import { userSchema } from "./user.schemas";

export const authSignInInputSchema = z.object({
  email: z.string(),
  username: z.string(),
  password: z.string(),
});

export const authSignInWithGoogleSchema = z.object({ code: z.string() });

export type AuthSignInInput = z.infer<typeof authSignInInputSchema>;

export const authSignUpSchema = z.object({
  email: z.string(),
  password: z.string(),
});
export type AuthSignUpInput = z.infer<typeof authSignUpSchema>;

export type AuthSignInWithGoogleInput = z.infer<
  typeof authSignInWithGoogleSchema
>;

export const authUserSchema = userSchema.omit({
  passwordHash: true,
});

export type AuthUser = z.infer<typeof authUserSchema>;

export type GoogleUser = {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  picture: string;
};

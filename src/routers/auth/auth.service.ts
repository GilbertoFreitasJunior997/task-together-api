import { TRPCError } from "@trpc/server";
import { eq, getTableColumns } from "drizzle-orm";
import { Response, Request } from "express";
import { db } from "../../database";
import { usersTable } from "../../database/tables";
import { setTokenCookie } from "../../lib/jwt";
import { comparePassword, hashPassword } from "../../lib/password";
import {
  AuthSignInInput,
  AuthSignUpInput,
  GoogleUser,
} from "../../schemas/auth.schemas";
import { OAuth2Client } from "google-auth-library";
import { env } from "../../lib/env";

const client = new OAuth2Client(
  env.GOOGLE_AUTH_CLIENT_ID,
  env.GOOGLE_AUTH_CLIENT_SECRET,
  env.GOOGLE_REDIRECT_URI,
);

export const authService = {
  signUp: async (dto: AuthSignInInput, res: Response) => {
    const userWithSameEmail = await db.query.usersTable.findFirst({
      columns: {
        email: true,
      },
      where: eq(usersTable.email, dto.email),
    });

    if (userWithSameEmail) {
      throw new TRPCError({
        message:
          "This email is already registered. Please provide another one.",
        code: "BAD_REQUEST",
      });
    }

    const passwordHash = await hashPassword(dto.password);
    const { passwordHash: _, ...returnColumns } = getTableColumns(usersTable);

    try {
      const [user] = await db
        .insert(usersTable)
        .values({
          email: dto.email,
          username: dto.username,
          passwordHash,
        })
        .returning(returnColumns);

      setTokenCookie(user, res);
      return user;
    } catch (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        cause: error,
      });
    }
  },

  signIn: async (dto: AuthSignUpInput, res: Response) => {
    const dbUser = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, dto.email),
    });

    if (!dbUser) {
      throw new TRPCError({
        message: "User not found",
        code: "BAD_REQUEST",
      });
    }

    if (!dbUser.passwordHash) {
      throw new TRPCError({
        message: "User entered with a google account",
        code: "BAD_REQUEST",
      });
    }

    const passwordsMatch = await comparePassword(
      dto.password,
      dbUser.passwordHash,
    );

    if (!passwordsMatch) {
      throw new TRPCError({
        message: "User not found",
        code: "BAD_REQUEST",
      });
    }

    const { passwordHash: _, ...user } = dbUser;

    setTokenCookie(user, res);
    return user;
  },
  generateGoogleAuthUrl: () => {
    const url = client.generateAuthUrl({
      access_type: "offline",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ],
    });

    return url;
  },
  signInWithGoogle: async (req: Request, res: Response) => {
    const { code } = req.query;

    const { tokens } = await client.getToken(code as string);
    client.setCredentials(tokens);

    const oauth2 = await client.request({
      url: "https://www.googleapis.com/oauth2/v2/userinfo",
    });

    const userInfo = oauth2.data as GoogleUser;

    const dbUser = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, userInfo.email),
    });

    const { passwordHash: _, ...returnColumns } = getTableColumns(usersTable);

    if (dbUser) {
      const [user] = await db
        .update(usersTable)
        .set({ avatarUrl: userInfo.picture, googleId: userInfo.id })
        .where(eq(usersTable.id, dbUser.id))
        .returning(returnColumns);

      setTokenCookie(user, res);
      res.redirect("/dashboard");
    }

    const [user] = await db
      .insert(usersTable)
      .values({
        email: userInfo.email,
        username: userInfo.name,
      })
      .returning(returnColumns);

    setTokenCookie(user, res);
    res.redirect("/dashboard");
  },
};

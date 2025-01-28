import { TRPCError } from "@trpc/server";
import { eq, getTableColumns } from "drizzle-orm";
import { Response } from "express";
import { db } from "../../database";
import { usersTable } from "../../database/tables";
import { setTokenCookie } from "../../lib/jwt";
import { comparePassword, hashPassword } from "../../lib/password";
import { AuthSignInInput, AuthSignUpInput } from "../../schemas/auth.schemas";

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
};

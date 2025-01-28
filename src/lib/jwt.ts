import { TRPCError } from "@trpc/server";
import { Response } from "express";
import jwt from "jsonwebtoken";
import { AuthUser } from "../schemas/auth.schemas";
import { env } from "./env";

export const createToken = (user: AuthUser) => {
  const token = jwt.sign(user, env.TOKEN_SECRET);

  return token;
};

export const decodeToken = (token: string) => {
  try {
    const user = jwt.verify(token, env.TOKEN_SECRET) as AuthUser;

    return user;
  } catch (error) {
    throw new TRPCError({
      message: "Your session is invalid",
      code: "UNAUTHORIZED",
      cause: error,
    });
  }
};

const TOKEN_COOKIE_NAME = "token";
export const getUserFromCookies = (cookies?: Record<string, string>) => {
  const token = cookies?.[TOKEN_COOKIE_NAME];

  if (!token) {
    throw new TRPCError({
      message: "Please provide a token",
      code: "UNAUTHORIZED",
    });
  }

  const user = decodeToken(token);
  return user;
};

export const setTokenCookie = (user: AuthUser, res: Response) => {
  const token = createToken(user);
  res.cookie(TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    partitioned: true,
  });
};

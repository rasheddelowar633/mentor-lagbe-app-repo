import { createAuthClient } from "better-auth/react";
import { AUTH_URL } from "@/lib/api";

/**
 * BetterAuth client connected to the Express backend.
 * Docs: https://www.better-auth.com/docs
 */
export const authClient = createAuthClient({
  baseURL: AUTH_URL,
  fetchOptions: {
    credentials: "include",
  },
});

export const { signIn, signUp, signOut, getSession, updateUser } = authClient;

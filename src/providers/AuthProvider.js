"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { authClient } from "@/lib/authClient";
import { apiFetch, clearToken, getToken, setToken } from "@/lib/api";

const AuthContext = createContext(null);

/**
 * Global auth state.
 *
 * Flow:
 *  1. Sign up / sign in happens through BetterAuth on the Express backend.
 *  2. After a session exists we request a JWT from BetterAuth's `GET /token`
 *     (jwt plugin) and store it in localStorage.
 *  3. Every protected API request sends `Authorization: Bearer <jwt>`.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const bootstrapped = useRef(false);

  const fetchProfile = useCallback(async () => {
    try {
      const data = await apiFetch("/api/users/me");
      const nextProfile = data?.user || data?.data || data;
      setProfile(nextProfile && typeof nextProfile === "object" ? nextProfile : null);
      return nextProfile;
    } catch {
      setProfile(null);
      return null;
    }
  }, []);

  const refresh = useCallback(async () => {
    try {
      const { data: session } = await authClient.getSession();

      if (!session?.user) {
        setUser(null);
        setProfile(null);
        clearToken();
        return { user: null, profile: null };
      }

      setUser(session.user);

      // 1) Prefer a real JWT from the BetterAuth jwt plugin.
      let token = null;
      try {
        const res = await fetch(`${authClient.options.baseURL}/token`, {
          credentials: "include",
        });
        if (res.ok) {
          const json = await res.json().catch(() => null);
          token = json?.token || null;
        }
      } catch {
        /* jwt plugin may be disabled on the backend */
      }

      // 2) Fallback: the BetterAuth session token.
      token = token || session?.session?.token || getToken();
      setToken(token);

      // 3) Load our extended user document (role, plan, bio, phone...).
      const nextProfile = await fetchProfile();

      return {
        user: session.user,
        profile: nextProfile,
        role: nextProfile?.role || session.user.role || null,
      };
    } catch {
      setUser(null);
      setProfile(null);
      clearToken();
      return { user: null, profile: null };
    } finally {
      setLoading(false);
    }
  }, [fetchProfile]);

  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;
    void refresh();
  }, [refresh]);

  const signIn = useCallback(
    async ({ email, password }) => {
      const { data, error } = await authClient.signIn.email({ email, password });
      if (error) {
        throw new Error(error.message || "Unable to sign in. Please try again.");
      }
      if (data?.token) setToken(data.token);
      return refresh();
    },
    [refresh],
  );

  const signUp = useCallback(
    async ({ name, email, password, role }) => {
      const { data, error } = await authClient.signUp.email({
        name,
        email,
        password,
        role,
      });
      if (error) {
        throw new Error(error.message || "Unable to create your account.");
      }
      if (data?.token) setToken(data.token);
      return refresh();
    },
    [refresh],
  );

  const signOut = useCallback(async () => {
    try {
      await authClient.signOut();
    } catch {
      /* ignore – we clear local state anyway */
    }
    setUser(null);
    setProfile(null);
    clearToken();
  }, []);

  const updateProfile = useCallback(async (patch) => {
    const data = await apiFetch("/api/users/me", {
      method: "PATCH",
      body: patch,
    });
    const nextProfile = data?.user || data?.data || data;
    if (nextProfile && typeof nextProfile === "object") {
      setProfile((prev) => ({ ...(prev || {}), ...nextProfile }));
      setUser((prev) =>
        prev
          ? {
              ...prev,
              name: nextProfile.name ?? prev.name,
              image: nextProfile.image ?? prev.image,
            }
          : prev,
      );
    }
    return nextProfile;
  }, []);

  const role = profile?.role || user?.role || null;
  const plan = profile?.plan || "free";

  const value = useMemo(
    () => ({
      user,
      profile,
      role,
      plan,
      loading,
      isAuthenticated: Boolean(user),
      refresh,
      signIn,
      signUp,
      signOut,
      updateProfile,
    }),
    [user, profile, role, plan, loading, refresh, signIn, signUp, signOut, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

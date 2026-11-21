
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

import {
  apiFetch,
  clearToken,
  setToken,
  AUTH_URL,
} from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const bootstrapped = useRef(false);

  // =====================================
  // FETCH USER PROFILE
  // =====================================

  const fetchProfile = useCallback(async () => {
    try {
      const data = await apiFetch("/api/users/me");

      const nextProfile =
        data?.user ||
        data?.data ||
        data;

      setProfile(
        nextProfile && typeof nextProfile === "object"
          ? nextProfile
          : null
      );

      return nextProfile;
    } catch (error) {
      console.error("Profile loading failed:", error);
      setProfile(null);
      return null;
    }
  }, []);

  // =====================================
  // GET BETTER AUTH JWT
  // =====================================

  const getAuthJWT = useCallback(async () => {
    try {
      console.log("Better Auth URL:", AUTH_URL);
      console.log("Better Auth URL type:", typeof AUTH_URL);

      const response = await fetch(`${AUTH_URL}/token`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      if (!response.ok) {
        const errorText = await response.text();

        console.error("JWT request failed:", {
          status: response.status,
          message: errorText,
        });

        return null;
      }

      const result = await response.json();

      const jwtToken = result?.token || null;

      if (!jwtToken) {
        console.error("Better Auth did not return a JWT:", result);
        return null;
      }

      return jwtToken;
    } catch (error) {
      console.error("JWT generation failed:", error);
      return null;
    }
  }, []);

  // =====================================
  // REFRESH AUTHENTICATION
  // =====================================

  const refresh = useCallback(async () => {
    try {
      const { data: session, error } =
        await authClient.getSession();

      if (error) {
        throw new Error(
          error.message || "Unable to get authentication session."
        );
      }

      if (!session?.user) {
        setUser(null);
        setProfile(null);
        clearToken();

        return {
          user: null,
          profile: null,
          role: null,
        };
      }

      setUser(session.user);

      const jwtToken = await getAuthJWT();

      if (!jwtToken) {
        clearToken();
        setProfile(null);

        return {
          user: session.user,
          profile: null,
          role: session.user.role || null,
        };
      }

      setToken(jwtToken);

      const nextProfile = await fetchProfile();

      return {
        user: session.user,
        profile: nextProfile,
        role:
          nextProfile?.role ||
          session.user.role ||
          null,
      };
    } catch (error) {
      console.error("Authentication refresh failed:", error);

      setUser(null);
      setProfile(null);
      clearToken();

      return {
        user: null,
        profile: null,
        role: null,
      };
    } finally {
      setLoading(false);
    }
  }, [fetchProfile, getAuthJWT]);

  // =====================================
  // INITIAL AUTHENTICATION
  // =====================================

  useEffect(() => {
    if (bootstrapped.current) return;

    bootstrapped.current = true;

    void refresh();
  }, [refresh]);

  // =====================================
  // SIGN IN
  // =====================================

  const signIn = useCallback(
    async ({ email, password }) => {
      const { error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        throw new Error(
          error.message ||
            "Unable to sign in. Please try again."
        );
      }

      clearToken();

      return refresh();
    },
    [refresh]
  );

  // =====================================
  // SIGN UP
  // =====================================

  const signUp = useCallback(
    async ({ name, email, password, role }) => {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
        role,
      });

      if (error) {
        throw new Error(
          error.message ||
            "Unable to create your account."
        );
      }

      clearToken();

      return refresh();
    },
    [refresh]
  );

  // =====================================
  // SIGN OUT
  // =====================================

  const signOut = useCallback(async () => {
    try {
      await authClient.signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    }

    setUser(null);
    setProfile(null);
    clearToken();
  }, []);

  // =====================================
  // UPDATE PROFILE
  // =====================================

  const updateProfile = useCallback(async (patch) => {
    const data = await apiFetch("/api/users/me", {
      method: "PATCH",
      body: patch,
    });

    const nextProfile =
      data?.user ||
      data?.data ||
      data;

    if (
      nextProfile &&
      typeof nextProfile === "object"
    ) {
      setProfile((prev) => ({
        ...(prev || {}),
        ...nextProfile,
      }));

      setUser((prev) =>
        prev
          ? {
              ...prev,
              name: nextProfile.name ?? prev.name,
              image: nextProfile.image ?? prev.image,
            }
          : prev
      );
    }

    return nextProfile;
  }, []);

  // =====================================
  // USER ROLE AND PLAN
  // =====================================

  const role =
    profile?.role ||
    user?.role ||
    null;

  const plan =
    profile?.plan ||
    "free";

  // =====================================
  // AUTH CONTEXT VALUE
  // =====================================

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
    [
      user,
      profile,
      role,
      plan,
      loading,
      refresh,
      signIn,
      signUp,
      signOut,
      updateProfile,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// =====================================
// USE AUTH HOOK
// =====================================

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      "useAuth must be used inside <AuthProvider>"
    );
  }

  return ctx;
}

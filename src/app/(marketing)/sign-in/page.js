"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AlertCircle, ArrowRight, Loader2, Lock, Mail } from "lucide-react";
import AuthAside, { AUTH_POINTS } from "@/components/auth/AuthAside";
import Logo from "@/components/Logo";
import { useAuth } from "@/providers/AuthProvider";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function dashboardPath(role) {
  if (role === "admin") return "/dashboard/admin";
  if (role === "tutor") return "/dashboard/tutor";
  return "/dashboard/student";
}

export function SignInContent() {
  const router = useRouter();
  const { signIn, isAuthenticated, loading: authLoading, role } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace(dashboardPath(role));
    }
  }, [authLoading, isAuthenticated, role, router]);

  const setField = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.email.trim()) next.email = "Please enter your email address.";
    else if (!EMAIL_RE.test(form.email.trim()))
      next.email = "Please enter a valid email address.";
    if (!form.password) next.password = "Please enter your password.";
    else if (form.password.length < 8)
      next.password = "Password must be at least 8 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const result = await signIn({
        email: form.email.trim(),
        password: form.password,
      });
      toast.success("Signed in successfully — welcome back!");
      router.push(dashboardPath(result?.role || result?.profile?.role || "student"));
    } catch (error) {
      toast.error(error.message || "Invalid email or password.");
      setSubmitting(false);
    }
  };

  const fieldError = (key) =>
    errors[key] && (
      <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-error">
        <AlertCircle className="h-3.5 w-3.5" /> {errors[key]}
      </p>
    );

  return (
    <div className="container-x py-12 md:py-16">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2">
        <AuthAside title="Welcome back to MentorLagbe." points={AUTH_POINTS.signIn} />

        <div className="rounded-3xl border border-base-content/10 bg-base-100 p-7 shadow-xl shadow-primary/5 sm:p-9">
          <div className="lg:hidden">
            <Logo compact />
          </div>

          <h1 className="mt-5 text-2xl font-extrabold tracking-tight lg:mt-0">
            Sign in to your account
          </h1>
          <p className="mt-1.5 text-sm text-base-content/60">
            Use the email and password you registered with.
          </p>

          <form onSubmit={handleSubmit} noValidate className="mt-7 flex flex-col gap-5">
            <div>
              <label htmlFor="signin-email" className="field-label">
                Email address *
              </label>
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-base-content/45"
                  aria-hidden="true"
                />
                <input
                  id="signin-email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={setField("email")}
                  placeholder="you@example.com"
                  className="field-input !pl-10"
                />
              </div>
              {fieldError("email")}
            </div>

            <div>
              <label htmlFor="signin-password" className="field-label">
                Password *
              </label>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-base-content/45"
                  aria-hidden="true"
                />
                <input
                  id="signin-password"
                  type="password"
                  autoComplete="current-password"
                  value={form.password}
                  onChange={setField("password")}
                  placeholder="••••••••"
                  className="field-input !pl-10"
                />
              </div>
              {fieldError("password")}
            </div>

            <button type="submit" disabled={submitting} className="btn-brand w-full">
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
                </>
              ) : (
                <>
                  Sign In <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-sm font-medium text-base-content/60">
            New to MentorLagbe?{" "}
            <Link href="/sign-up" className="font-extrabold text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="container-x flex min-h-[60vh] items-center justify-center py-16">
          <span className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}

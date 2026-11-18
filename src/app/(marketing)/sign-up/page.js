"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { AlertCircle, ArrowRight, GraduationCap, Loader2, UserRound } from "lucide-react";
import AuthAside, { AUTH_POINTS } from "@/components/auth/AuthAside";
import Logo from "@/components/Logo";
import { useAuth } from "@/providers/AuthProvider";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function dashboardPath(role) {
  if (role === "admin") return "/dashboard/admin";
  if (role === "tutor") return "/dashboard/tutor";
  return "/dashboard/student";
}

export function SignUpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signUp, isAuthenticated, loading: authLoading, role } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  /* Adjust from props during render: preset role from ?role= query string. */
  const presetRole = searchParams.get("role");
  const [appliedPreset, setAppliedPreset] = useState(presetRole);
  if (
    presetRole !== appliedPreset &&
    (presetRole === "tutor" || presetRole === "student")
  ) {
    setAppliedPreset(presetRole);
    setForm((prev) => ({ ...prev, role: presetRole }));
  }

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
    if (!form.name.trim()) next.name = "Please enter your full name.";
    if (!form.email.trim()) next.email = "Please enter your email address.";
    else if (!EMAIL_RE.test(form.email.trim()))
      next.email = "Please enter a valid email address.";
    if (!form.password) next.password = "Please choose a password.";
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
      await signUp({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      });
      toast.success("Welcome to MentorLagbe! Your account is ready.");
      router.push(dashboardPath(form.role));
    } catch (error) {
      toast.error(error.message || "Could not create your account.");
    } finally {
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
        <AuthAside title="Start teaching or learning in minutes." points={AUTH_POINTS.signUp} />

        <div className="rounded-3xl border border-base-content/10 bg-base-100 p-7 shadow-xl shadow-primary/5 sm:p-9">
          <div className="lg:hidden">
            <Logo compact />
          </div>

          <h1 className="mt-5 text-2xl font-extrabold tracking-tight lg:mt-0">
            Create your account
          </h1>
          <p className="mt-1.5 text-sm text-base-content/60">
            Join as a Student or Tutor — it&apos;s free to get started.
          </p>

          <form onSubmit={handleSubmit} noValidate className="mt-7 flex flex-col gap-5">
            {/* Role selection */}
            <fieldset>
              <legend className="field-label">I am joining as *</legend>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "student", label: "Student", icon: UserRound, text: "Find tuitions" },
                  { value: "tutor", label: "Tutor", icon: GraduationCap, text: "Post batches" },
                ].map(({ value, label, icon: Icon, text }) => (
                  <label
                    key={value}
                    className={`cursor-pointer rounded-2xl border p-4 text-center transition-all ${
                      form.role === value
                        ? "border-primary bg-primary/10 shadow-md shadow-primary/10"
                        : "border-base-content/15 bg-base-100 hover:border-primary/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={value}
                      checked={form.role === value}
                      onChange={setField("role")}
                      className="sr-only"
                    />
                    <Icon
                      className={`mx-auto h-6 w-6 ${
                        form.role === value ? "text-primary" : "text-base-content/50"
                      }`}
                      aria-hidden="true"
                    />
                    <span className="mt-2 block text-sm font-extrabold">{label}</span>
                    <span className="text-[11px] font-semibold text-base-content/50">
                      {text}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor="signup-name" className="field-label">
                Full name *
              </label>
              <input
                id="signup-name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={setField("name")}
                placeholder="e.g. Rafiul Islam"
                className="field-input"
              />
              {fieldError("name")}
            </div>

            <div>
              <label htmlFor="signup-email" className="field-label">
                Email address *
              </label>
              <input
                id="signup-email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={setField("email")}
                placeholder="you@example.com"
                className="field-input"
              />
              {fieldError("email")}
            </div>

            <div>
              <label htmlFor="signup-password" className="field-label">
                Password *
              </label>
              <input
                id="signup-password"
                type="password"
                autoComplete="new-password"
                value={form.password}
                onChange={setField("password")}
                placeholder="Minimum 8 characters"
                className="field-input"
              />
              {fieldError("password")}
            </div>

            <button type="submit" disabled={submitting} className="btn-brand w-full">
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Creating account…
                </>
              ) : (
                <>
                  Create account <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-sm font-medium text-base-content/60">
            Already have an account?{" "}
            <Link href="/sign-in" className="font-extrabold text-primary hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="container-x flex min-h-[60vh] items-center justify-center py-16">
          <span className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <SignUpContent />
    </Suspense>
  );
}

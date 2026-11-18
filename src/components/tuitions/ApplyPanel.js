"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Ban,
  CheckCircle2,
  Loader2,
  LogIn,
  Send,
  ShieldAlert,
  UserRound,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";

/**
 * Application panel on the tuition details page.
 * Only students may apply — tutors and admins see a disabled state with a notice.
 */
export default function ApplyPanel({ tuition }) {
  const router = useRouter();
  const { user, profile, role, isAuthenticated, loading } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    phone: profile?.phone || "",
    preferredSchedule: "",
    studentNote: "",
  });

  const setField = (key) => (event) =>
    setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.phone.trim()) {
      toast.error("Please enter your phone number.");
      return;
    }
    if (!form.preferredSchedule.trim()) {
      toast.error("Please share your preferred schedule.");
      return;
    }

    setSubmitting(true);
    try {
      await apiFetch("/api/applications", {
        method: "POST",
        body: {
          tuitionId: tuition._id || tuition.id,
          studentPhone: form.phone.trim(),
          preferredSchedule: form.preferredSchedule.trim(),
          studentNote: form.studentNote.trim(),
        },
      });
      toast.success("Application submitted! The tutor will review it shortly.");
      router.push("/dashboard/student/my-applications");
    } catch (error) {
      if (error.status === 409) {
        toast.info("You have already applied to this tuition.");
      } else {
        toast.error(error.message || "Could not submit your application.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------------- non-student states ---------------- */

  if (loading) {
    return (
      <div className="rounded-3xl border border-base-content/10 bg-base-100 p-6">
        <div className="skeleton h-8 w-32 rounded" />
        <div className="skeleton mt-4 h-24 w-full rounded-xl" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="rounded-3xl border border-base-content/10 bg-base-100 p-6">
        <h3 className="text-lg font-extrabold">Apply for this tuition</h3>
        <p className="mt-2 text-sm text-base-content/65">
          Sign in with a <strong>Student</strong> account to send your
          application to the tutor.
        </p>
        <Link href="/sign-in" className="btn-brand mt-5 w-full">
          <LogIn className="h-4 w-4" /> Sign in to apply
        </Link>
        <p className="mt-3 text-center text-xs font-semibold text-base-content/50">
          New here?{" "}
          <Link href="/sign-up?role=student" className="text-primary">
            Create a student account
          </Link>
        </p>
      </div>
    );
  }

  if (role !== "student") {
    return (
      <div className="rounded-3xl border border-base-content/10 bg-base-100 p-6">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-warning/15 text-warning">
          <ShieldAlert className="h-5 w-5" aria-hidden="true" />
        </span>
        <h3 className="mt-4 text-lg font-extrabold">Applications are students only</h3>
        <p className="mt-2 text-sm text-base-content/65">
          You are signed in as a <strong>{role}</strong>. Only student accounts
          can apply for tuitions — manage your own posts from the dashboard
          instead.
        </p>
        <button
          type="button"
          disabled
          className="btn mt-5 w-full cursor-not-allowed border border-base-content/15 bg-base-200 font-bold opacity-70"
        >
          <Ban className="h-4 w-4" /> Apply Now (disabled)
        </button>
        <Link
          href={role === "admin" ? "/dashboard/admin" : "/dashboard/tutor"}
          className="btn-ghost-brand mt-3 w-full"
        >
          Go to my dashboard
        </Link>
      </div>
    );
  }

  /* ---------------- student application form ---------------- */

  return (
    <div className="rounded-3xl border border-primary/30 bg-base-100 p-6 shadow-xl shadow-primary/10">
      <div className="flex items-center gap-2">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
          <Send className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h3 className="text-lg font-extrabold leading-tight">Apply for this tuition</h3>
          <p className="text-xs font-semibold text-base-content/55">
            Applying as {user?.name}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
        <div>
          <label htmlFor="apply-phone" className="field-label">
            Phone number *
          </label>
          <input
            id="apply-phone"
            type="tel"
            required
            value={form.phone}
            onChange={setField("phone")}
            placeholder="01XXXXXXXXX"
            className="field-input"
          />
        </div>

        <div>
          <label htmlFor="apply-schedule" className="field-label">
            Preferred schedule *
          </label>
          <input
            id="apply-schedule"
            type="text"
            required
            value={form.preferredSchedule}
            onChange={setField("preferredSchedule")}
            placeholder="e.g. Sat–Wed, 7:00–8:30 PM"
            className="field-input"
          />
        </div>

        <div>
          <label htmlFor="apply-note" className="field-label">
            Learning note
          </label>
          <textarea
            id="apply-note"
            rows={3}
            value={form.studentNote}
            onChange={setField("studentNote")}
            placeholder="Tell the tutor what you want to focus on…"
            className="field-input resize-none"
          />
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-base-200 px-3 py-2.5 text-xs font-semibold text-base-content/65">
          <UserRound className="h-4 w-4 shrink-0 text-primary" />
          <span className="truncate">{profile?.email || user?.email}</span>
        </div>

        <button type="submit" disabled={submitting} className="btn-brand w-full">
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" /> Submit application
            </>
          )}
        </button>

        <p className="text-center text-[11px] font-medium text-base-content/50">
          Your application is saved with status <strong>pending</strong> until the
          tutor accepts or rejects it.
        </p>
      </form>
    </div>
  );
}

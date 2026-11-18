"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Plus,
  Sparkles,
  Users,
} from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import { StatCardSkeleton } from "@/components/Skeletons";
import { apiFetch } from "@/lib/api";
import { pickList } from "@/lib/payload";
import { useAuth } from "@/providers/AuthProvider";

const APPROVAL_BADGE = {
  pending: "badge-warning",
  approved: "badge-success",
  rejected: "badge-error",
};

export default function TutorOverviewPage() {
  const { user, plan } = useAuth();
  const [tuitions, setTuitions] = useState(null);
  const [applications, setApplications] = useState(null);
  const [tuitionError, setTuitionError] = useState(null);
  const [applicationError, setApplicationError] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const [tuitionsResult, applicationsResult] = await Promise.allSettled([
        apiFetch("/api/tuitions/my"),
        apiFetch("/api/applications/received"),
      ]);

      if (!active) return;

      if (tuitionsResult.status === "fulfilled") {
        setTuitions(pickList(tuitionsResult.value));
      } else {
        setTuitions([]);
        setTuitionError(
          tuitionsResult.reason?.message || "Could not load your tuitions.",
        );
      }

      if (applicationsResult.status === "fulfilled") {
        setApplications(pickList(applicationsResult.value));
      } else {
        setApplications([]);
        setApplicationError(
          applicationsResult.reason?.message || "Could not load your applicants.",
        );
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const error = [tuitionError, applicationError].filter(Boolean).join(" · ") || null;
  const tuitionList = tuitions || [];
  const applicationList = applications || [];
  const approvedCount = tuitionList.filter(
    (item) => item.approvalStatus === "approved" && item.isActive !== false,
  ).length;
  const recent = [...tuitionList]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 4);

  const isLoading = (tuitions === null || applications === null) && !error;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">
          Welcome back, {user?.name?.split(" ")[0] || "Tutor"} 👋
        </h1>
        <p className="mt-1 text-sm text-base-content/60">
          Manage your tuition posts, track applicants and keep your batches
          running smoothly.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-error/30 bg-error/10 px-4 py-3 text-sm font-semibold text-error">
          {error} — make sure the MentorLagbe API is running.
        </div>
      )}

      {isLoading ? (
        <StatCardSkeleton count={4} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={BookOpen}
            label="Tuitions posted"
            value={tuitionList.length}
            hint="Total batches you created"
            tone="primary"
          />
          <StatCard
            icon={CheckCircle2}
            label="Active / approved"
            value={approvedCount}
            hint="Approved & currently active"
            tone="success"
          />
          <StatCard
            icon={Users}
            label="Applicants received"
            value={applicationList.length}
            hint="Students who applied to you"
            tone="secondary"
          />
          <StatCard
            icon={Sparkles}
            label="Current plan"
            value={plan === "pro" ? "PRO" : "Free"}
            hint={
              plan === "pro"
                ? "Unlimited tuition posts"
                : "Upgrade for unlimited posts"
            }
            tone={plan === "pro" ? "accent" : "info"}
          />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent tuition posts */}
        <div className="rounded-3xl border border-base-content/10 bg-base-100 p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-extrabold">Recent tuition posts</h2>
            <Link
              href="/dashboard/tutor/my-tuitions"
              className="inline-flex items-center gap-1 text-xs font-extrabold text-primary hover:underline"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {recent.map((item, index) => (
              <div
                key={item._id || index}
                className="flex items-center justify-between gap-3 rounded-2xl border border-base-content/10 bg-base-200/60 px-4 py-3"
              >
                <div className="min-w-0">
                  <Link
                    href="/dashboard/tutor/my-tuitions"
                    className="block truncate text-sm font-extrabold hover:text-primary"
                  >
                    {item.title || "Untitled tuition"}
                  </Link>
                  <p className="truncate text-xs font-semibold text-base-content/55">
                    {[item.subject, item.classLevel, item.mode]
                      .filter(Boolean)
                      .join(" · ") || "Tuition batch"}
                  </p>
                </div>
                <span
                  className={`badge badge-sm shrink-0 font-bold ${
                    APPROVAL_BADGE[item.approvalStatus] || "badge-ghost"
                  }`}
                >
                  {item.approvalStatus || "pending"}
                </span>
              </div>
            ))}

            {recent.length === 0 && (
              <p className="rounded-2xl border border-dashed border-base-content/20 px-4 py-6 text-center text-sm font-semibold text-base-content/55">
                You have not posted any tuition yet.
              </p>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="rounded-3xl border border-base-content/10 bg-base-100 p-6">
          <h2 className="font-extrabold">Quick actions</h2>
          <p className="mt-1 text-sm text-base-content/60">
            The things you do most, one click away.
          </p>

          <div className="mt-4 flex flex-col gap-3">
            <Link
              href="/dashboard/tutor/post-tuition"
              className="flex items-center justify-between gap-3 rounded-2xl border border-base-content/10 bg-base-200/60 px-4 py-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
            >
              <span className="min-w-0">
                <span className="block text-sm font-extrabold">
                  Post a Tuition
                </span>
                <span className="block truncate text-xs font-semibold text-base-content/55">
                  Create a new batch and send it for admin approval
                </span>
              </span>
              <span className="btn-brand shrink-0 !px-4 !py-2 text-xs">
                <Plus className="h-4 w-4" /> New
              </span>
            </Link>

            <Link
              href="/dashboard/tutor/applicants"
              className="flex items-center justify-between gap-3 rounded-2xl border border-base-content/10 bg-base-200/60 px-4 py-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
            >
              <span className="min-w-0">
                <span className="block text-sm font-extrabold">
                  Manage Applicants
                </span>
                <span className="block truncate text-xs font-semibold text-base-content/55">
                  Accept or reject students waiting on your reply
                </span>
              </span>
              <span className="btn-ghost-brand shrink-0 !px-4 !py-2 text-xs">
                <Users className="h-4 w-4" /> Review
              </span>
            </Link>

            <Link
              href="/dashboard/profile"
              className="flex items-center justify-between gap-3 rounded-2xl border border-base-content/10 bg-base-200/60 px-4 py-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
            >
              <span className="min-w-0">
                <span className="block text-sm font-extrabold">
                  Update Profile
                </span>
                <span className="block truncate text-xs font-semibold text-base-content/55">
                  Keep your photo, bio and contact details fresh
                </span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-base-content/40" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

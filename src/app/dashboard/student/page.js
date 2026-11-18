"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  Sparkles,
} from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import { EmptyState, StatCardSkeleton } from "@/components/Skeletons";
import { apiFetch } from "@/lib/api";
import { pickList } from "@/lib/payload";
import { useAuth } from "@/providers/AuthProvider";

export default function StudentOverviewPage() {
  const { user, plan } = useAuth();
  const [applications, setApplications] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const payload = await apiFetch("/api/applications/my");
        if (active) setApplications(pickList(payload));
      } catch (err) {
        if (active) setError(err.message);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const list = applications || [];
  const accepted = list.filter((item) => item.status === "accepted").length;
  const pending = list.filter((item) => item.status === "pending").length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">
          Welcome back, {user?.name?.split(" ")[0] || "Student"} 👋
        </h1>
        <p className="mt-1 text-sm text-base-content/60">
          Track every tuition you have applied for and see where each
          application stands.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-error/30 bg-error/10 px-4 py-3 text-sm font-semibold text-error">
          {error} — make sure the MentorLagbe API is running.
        </div>
      )}

      {applications === null && !error ? (
        <StatCardSkeleton count={4} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={FileText}
            label="Applied tuitions"
            value={list.length}
            hint="Total applications submitted"
            tone="primary"
          />
          <StatCard
            icon={CheckCircle2}
            label="Accepted"
            value={accepted}
            hint="Tutors who said yes"
            tone="success"
          />
          <StatCard
            icon={Clock}
            label="Pending"
            value={pending}
            hint="Waiting for tutor review"
            tone="warning"
          />
          <StatCard
            icon={Sparkles}
            label="Current plan"
            value={plan === "pro" ? "PRO" : "Free"}
            hint={
              plan === "pro"
                ? "Priority booking unlocked"
                : "Upgrade for priority booking"
            }
            tone={plan === "pro" ? "accent" : "info"}
          />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-base-content/10 bg-base-100 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold">Recent applications</h2>
            <Link
              href="/dashboard/student/my-applications"
              className="inline-flex items-center gap-1 text-xs font-extrabold text-primary hover:underline"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {list.slice(0, 4).map((item, index) => (
              <div
                key={item._id || index}
                className="flex items-center justify-between gap-3 rounded-2xl border border-base-content/10 bg-base-200/60 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-extrabold">
                    {item.tuitionTitle || "Tuition application"}
                  </p>
                  <p className="truncate text-xs font-semibold text-base-content/55">
                    {item.tutorName || item.tutorEmail || "Tutor"}
                  </p>
                </div>
                <span
                  className={`badge badge-sm font-bold ${
                    item.status === "accepted"
                      ? "badge-success"
                      : item.status === "rejected"
                        ? "badge-error"
                        : "badge-warning"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}

            {list.length === 0 && (
              <p className="rounded-2xl border border-dashed border-base-content/20 px-4 py-6 text-center text-sm font-semibold text-base-content/55">
                You have not applied to any tuition yet.
              </p>
            )}
          </div>
        </div>

        <EmptyState
          title="Keep exploring batches"
          description="New approved tuitions are published daily — filter by subject, class level and mode to find your perfect match."
          action={
            <Link href="/tuitions" className="btn-brand">
              Browse Tuitions <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
      </div>
    </div>
  );
}

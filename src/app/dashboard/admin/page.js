"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  CheckCircle2,
  Clock,
  CreditCard,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import { StatCardSkeleton } from "@/components/Skeletons";
import { apiFetch } from "@/lib/api";
import { pickList } from "@/lib/payload";

const ZERO_STATS = {
  totalUsers: 0,
  totalTutors: 0,
  pendingTuitions: 0,
  approvedTuitions: 0,
  totalRevenue: 0,
};

function formatDate(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState(null);
  const [tuitions, setTuitions] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const [statsResult, tuitionsResult] = await Promise.allSettled([
        apiFetch("/api/admin/stats"),
        apiFetch("/api/admin/tuitions"),
      ]);
      if (!active) return;

      const failures = [];

      if (statsResult.status === "fulfilled") {
        setStats({ ...ZERO_STATS, ...(statsResult.value || {}) });
      } else {
        failures.push(
          statsResult.reason?.message || "Could not load platform stats.",
        );
        setStats(ZERO_STATS);
      }

      if (tuitionsResult.status === "fulfilled") {
        setTuitions(pickList(tuitionsResult.value));
      } else {
        failures.push(
          tuitionsResult.reason?.message || "Could not load tuition posts.",
        );
        setTuitions([]);
      }

      if (failures.length) setError(failures.join(" "));
    })();
    return () => {
      active = false;
    };
  }, []);

  const displayStats = stats || ZERO_STATS;
  const pendingList = (tuitions || [])
    .filter((item) => item.approvalStatus === "pending")
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">
          Admin Overview
        </h1>
        <p className="mt-1 text-sm text-base-content/60">
          Platform health at a glance — users, tuition approvals and Stripe
          revenue.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-error/30 bg-error/10 px-4 py-3 text-sm font-semibold text-error">
          {error}
        </div>
      )}

      {stats === null && !error ? (
        <StatCardSkeleton count={4} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard
            icon={Users}
            label="Total users"
            value={Number(displayStats.totalUsers || 0).toLocaleString("en-US")}
            hint="Registered accounts"
            tone="primary"
          />
          <StatCard
            icon={UserRound}
            label="Total tutors"
            value={Number(displayStats.totalTutors || 0).toLocaleString("en-US")}
            hint="Teaching on MentorLagbe"
            tone="secondary"
          />
          <StatCard
            icon={Clock}
            label="Pending tuitions"
            value={Number(displayStats.pendingTuitions || 0).toLocaleString(
              "en-US",
            )}
            hint="awaiting approval"
            tone="warning"
          />
          <StatCard
            icon={CheckCircle2}
            label="Approved tuitions"
            value={Number(displayStats.approvedTuitions || 0).toLocaleString(
              "en-US",
            )}
            hint="Live on the platform"
            tone="success"
          />
          <div className="sm:col-span-2 xl:col-span-1">
            <StatCard
              icon={Wallet}
              label="Stripe revenue"
              value={`$${Number(displayStats.totalRevenue || 0).toLocaleString(
                "en-US",
              )}`}
              hint="Lifetime earnings"
              tone="accent"
            />
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Moderation queue */}
        <div className="rounded-3xl border border-base-content/10 bg-base-100 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold">Moderation queue</h2>
            <Link
              href="/dashboard/admin/tuitions"
              className="inline-flex items-center gap-1 text-xs font-extrabold text-primary hover:underline"
            >
              Review all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {tuitions === null && !error ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-base-content/10 bg-base-200/60 px-4 py-3"
                >
                  <div className="skeleton h-4 w-2/3 rounded" />
                  <div className="skeleton mt-2 h-3 w-1/3 rounded" />
                </div>
              ))
            ) : pendingList.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-base-content/20 px-4 py-6 text-center text-sm font-semibold text-base-content/55">
                Nothing is waiting for approval — the queue is clear.
              </p>
            ) : (
              pendingList.map((item, index) => (
                <div
                  key={item._id || index}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-base-content/10 bg-base-200/60 px-4 py-3"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/tuitions/${item._id}`}
                      className="block truncate text-sm font-extrabold hover:text-primary"
                    >
                      {item.title || "Tuition post"}
                    </Link>
                    <p className="truncate text-xs font-semibold text-base-content/55">
                      {item.tutorName || item.tutorEmail || "Tutor"} ·{" "}
                      {formatDate(item.createdAt)}
                    </p>
                  </div>
                  <span className="badge badge-sm badge-warning shrink-0 font-bold">
                    pending
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick links */}
        <div className="rounded-3xl border border-base-content/10 bg-base-100 p-6">
          <h2 className="font-extrabold">Quick links</h2>
          <div className="mt-4 flex flex-col gap-3">
            <Link
              href="/dashboard/admin/users"
              className="btn-brand w-full !justify-start text-sm"
            >
              <Users className="h-4 w-4" /> Manage Users
              <ArrowRight className="ml-auto h-4 w-4" />
            </Link>
            <Link
              href="/dashboard/admin/tuitions"
              className="btn-ghost-brand w-full !justify-start text-sm"
            >
              <CheckCircle2 className="h-4 w-4" /> Approve Tuitions
              <ArrowRight className="ml-auto h-4 w-4" />
            </Link>
            <Link
              href="/dashboard/admin/transactions"
              className="btn-ghost-brand w-full !justify-start text-sm"
            >
              <CreditCard className="h-4 w-4" /> View Transactions
              <ArrowRight className="ml-auto h-4 w-4" />
            </Link>
          </div>

          <div className="mt-5 flex items-center gap-2 border-t border-dashed border-base-content/15 pt-4 text-xs font-semibold text-base-content/55">
            <Banknote className="h-4 w-4 text-secondary" />
            Revenue updates automatically after every successful Stripe payment.
          </div>
        </div>
      </div>
    </div>
  );
}

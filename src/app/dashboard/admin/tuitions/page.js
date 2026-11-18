"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Banknote,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  Loader2,
  Mail,
  RefreshCw,
  UserRound,
  XCircle,
} from "lucide-react";
import {
  EmptyState,
  TuitionGridSkeleton,
} from "@/components/Skeletons";
import { apiFetch, resolveImageUrl } from "@/lib/api";
import { pickList } from "@/lib/payload";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

const STATUS_BADGE = {
  pending: "badge-warning",
  approved: "badge-success",
  rejected: "badge-error",
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

function subjectInitial(subject) {
  return (subject || "T").charAt(0).toUpperCase();
}

export default function AdminTuitionsPage() {
  const [tuitions, setTuitions] = useState(null);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [action, setAction] = useState(null); // `${tuitionId}:${approvalStatus}`

  const load = useCallback(async () => {
    try {
      const payload = await apiFetch("/api/admin/tuitions");
      setTuitions(pickList(payload));
      setError(null);
    } catch (err) {
      setError(err.message);
      setTuitions([]);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(load, 0);
    return () => clearTimeout(timer);
  }, [load]);

  const handleDecide = async (tuition, approvalStatus) => {
    const id = tuition._id || tuition.id;
    if (!id) return;
    setAction(`${id}:${approvalStatus}`);
    try {
      await apiFetch(`/api/admin/tuitions/${id}/approval`, {
        method: "PATCH",
        body: { approvalStatus },
      });
      setTuitions((prev) =>
        (prev || []).map((item) =>
          (item._id || item.id) === id ? { ...item, approvalStatus } : item,
        ),
      );
      toast.success(
        approvalStatus === "approved"
          ? `"${tuition.title || "Tuition"}" is now live.`
          : `"${tuition.title || "Tuition"}" has been rejected.`,
      );
    } catch (err) {
      toast.error(err.message || "Could not update the tuition.");
    } finally {
      setAction(null);
    }
  };

  const list = tuitions || [];

  const counts = {
    all: list.length,
    pending: list.filter((item) => item.approvalStatus === "pending").length,
    approved: list.filter((item) => item.approvalStatus === "approved").length,
    rejected: list.filter((item) => item.approvalStatus === "rejected").length,
  };

  const filtered =
    filter === "all"
      ? list
      : list.filter((item) => item.approvalStatus === filter);

  if (tuitions === null && !error) {
    return (
      <div className="flex flex-col gap-6">
        <div className="skeleton h-8 w-64 rounded-lg" />
        <TuitionGridSkeleton count={6} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">
          Tuition Approval Flow
        </h1>
        <p className="mt-1 text-sm text-base-content/60">
          Review every tuition post submitted by tutors — approve the good ones
          and reject the rest.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-error/30 bg-error/10 px-4 py-3 text-sm font-semibold text-error">
          {error}
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 rounded-2xl border border-base-content/10 bg-base-100 p-1.5 sm:w-fit">
        {FILTERS.map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => setFilter(option.key)}
            className={`rounded-xl px-4 py-2 text-xs font-extrabold uppercase tracking-widest transition ${
              filter === option.key
                ? "bg-primary text-primary-content shadow-md shadow-primary/25"
                : "text-base-content/60 hover:bg-base-200 hover:text-base-content"
            }`}
          >
            {option.label} ({counts[option.key]})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title={
            error
              ? "Tuitions unavailable"
              : filter === "all"
                ? "No tuition posts yet"
                : `No ${filter} tuitions`
          }
          description={
            error
              ? "We could not reach the tuitions API — fix the connection and reload."
              : filter === "all"
                ? "When tutors submit a tuition for review it will land here for approval."
                : `Nothing matches the "${filter}" filter right now.`
          }
          action={
            filter === "all" ? (
              <button
                type="button"
                onClick={() => void load()}
                className="btn-ghost-brand"
              >
                <RefreshCw className="h-4 w-4" /> Reload
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setFilter("all")}
                className="btn-ghost-brand"
              >
                Show all tuitions
              </button>
            )
          }
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((tuition) => {
            const id = tuition._id || tuition.id;
            const status = tuition.approvalStatus || "pending";
            const pending = status === "pending";
            const cardBusy = Boolean(action) && action.startsWith(`${id}:`);
            const approveBusy = action === `${id}:approved`;
            const rejectBusy = action === `${id}:rejected`;
            const image = resolveImageUrl(tuition.bannerImage);

            return (
              <article
                key={id}
                className={`flex flex-col overflow-hidden rounded-3xl border border-base-content/10 bg-base-100 transition-all ${
                  pending
                    ? "ring-1 ring-warning/40"
                    : "hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10"
                }`}
              >
                {/* Banner */}
                <div className="relative h-36 shrink-0 overflow-hidden bg-base-300">
                  {image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={image}
                      alt={tuition.title || tuition.subject || "Tuition banner"}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center bg-gradient-to-br from-primary/85 via-primary/60 to-secondary/70">
                      <span className="text-4xl font-extrabold text-white/90">
                        {subjectInitial(tuition.subject)}
                      </span>
                    </div>
                  )}
                  <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                    <span
                      className={`badge badge-sm font-bold ${STATUS_BADGE[status] || "badge-ghost"}`}
                    >
                      {status}
                    </span>
                    <span
                      className={`badge badge-sm font-bold ${
                        tuition.isActive ? "badge-success" : "badge-ghost"
                      }`}
                    >
                      {tuition.isActive ? "Active" : "Closed"}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-5">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-primary">
                    {tuition.subject || "Subject"}
                  </span>
                  <h3 className="mt-2 line-clamp-2 text-base font-extrabold leading-snug">
                    {tuition.title || "Untitled tuition"}
                  </h3>

                  <div className="mt-3 flex flex-col gap-1.5 text-xs font-semibold text-base-content/60">
                    <span className="flex items-center gap-1.5">
                      <GraduationCap className="h-3.5 w-3.5 shrink-0 text-secondary" />
                      {tuition.classLevel || "—"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <UserRound className="h-3.5 w-3.5 shrink-0 text-primary" />
                      <span className="truncate">
                        {tuition.tutorName || "Tutor"}
                      </span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 shrink-0 text-primary" />
                      <span className="truncate">
                        {tuition.tutorEmail || "—"}
                      </span>
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-2 border-t border-dashed border-base-content/15 pt-4 text-xs font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Banknote className="h-3.5 w-3.5 text-secondary" />
                      <span className="text-sm font-extrabold text-base-content">
                        ৳{Number(tuition.monthlyFee || 0).toLocaleString("en-US")}
                      </span>
                      <span className="text-base-content/50">/mo</span>
                    </span>
                    <span className="text-base-content/50">
                      {formatDate(tuition.createdAt)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex flex-wrap items-center gap-2 pt-1">
                    {status !== "approved" && (
                      <button
                        type="button"
                        onClick={() => handleDecide(tuition, "approved")}
                        disabled={cardBusy}
                        className="btn-brand !px-4 !py-2 gap-1.5 text-xs"
                      >
                        {approveBusy ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        )}
                        {approveBusy ? "Saving…" : "Approve"}
                      </button>
                    )}
                    {status !== "rejected" && (
                      <button
                        type="button"
                        onClick={() => handleDecide(tuition, "rejected")}
                        disabled={cardBusy}
                        className="btn btn-outline btn-error btn-sm gap-1.5 font-bold"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        {rejectBusy ? "Saving…" : "Reject"}
                      </button>
                    )}
                    <Link
                      href={`/tuitions/${id}`}
                      className="btn btn-ghost btn-sm gap-1.5 font-bold"
                    >
                      View <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

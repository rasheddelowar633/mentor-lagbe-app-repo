"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowRight,
  Banknote,
  CalendarDays,
  ExternalLink,
  Mail,
  Trash2,
  UserRound,
} from "lucide-react";
import { EmptyState, TableSkeleton } from "@/components/Skeletons";
import { apiFetch } from "@/lib/api";
import { pickList } from "@/lib/payload";

const STATUS_BADGE = {
  pending: "badge-warning",
  accepted: "badge-success",
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

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState(null);
  const [error, setError] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  const load = useCallback(async () => {
    try {
      const payload = await apiFetch("/api/applications/my");
      setApplications(pickList(payload));
      setError(null);
    } catch (err) {
      setError(err.message);
      setApplications([]);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(load, 0);
    return () => clearTimeout(timer);
  }, [load]);

  const handleCancel = async (application) => {
    const id = application._id || application.id;
    if (!id) return;
    setRemovingId(id);
    try {
      await apiFetch(`/api/applications/${id}`, { method: "DELETE" });
      toast.success("Application cancelled.");
      await load();
    } catch (err) {
      toast.error(err.message || "Could not cancel the application.");
    } finally {
      setRemovingId(null);
    }
  };

  if (applications === null && !error) {
    return (
      <div className="flex flex-col gap-6">
        <div className="skeleton h-8 w-64 rounded-lg" />
        <TableSkeleton rows={5} cols={5} />
      </div>
    );
  }

  const list = applications || [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">My Applications</h1>
          <p className="mt-1 text-sm text-base-content/60">
            Every tuition you have applied for, with its live status.
          </p>
        </div>
        <Link href="/tuitions" className="btn-ghost-brand !py-2.5 text-sm">
          Browse more tuitions <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {error && (
        <div className="rounded-2xl border border-error/30 bg-error/10 px-4 py-3 text-sm font-semibold text-error">
          {error}
        </div>
      )}

      {list.length === 0 ? (
        <EmptyState
          title="No applications yet"
          description="When you apply to a tuition batch it will show up here with its pending, accepted or rejected status."
          action={
            <Link href="/tuitions" className="btn-brand">
              Find a tuition <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-3xl border border-base-content/10 bg-base-100 md:block">
            <table className="table">
              <thead className="bg-base-200 text-xs font-extrabold uppercase tracking-widest text-base-content/60">
                <tr>
                  <th>Tuition</th>
                  <th>Tutor</th>
                  <th>Fee</th>
                  <th>Applied</th>
                  <th>Status</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {list.map((item) => (
                  <tr key={item._id || item.id} className="border-base-content/10">
                    <td>
                      <Link
                        href={`/tuitions/${item.tuitionId}`}
                        className="font-extrabold text-base-content hover:text-primary"
                      >
                        {item.tuitionTitle || "Tuition"}
                      </Link>
                      <p className="text-xs font-semibold text-base-content/50">
                        {item.subject || ""}
                      </p>
                    </td>
                    <td>
                      <span className="flex items-center gap-1.5 font-semibold">
                        <UserRound className="h-3.5 w-3.5 text-primary" />
                        {item.tutorName || "Tutor"}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-base-content/55">
                        <Mail className="h-3 w-3" />
                        {item.tutorEmail || "—"}
                      </span>
                    </td>
                    <td className="font-extrabold">
                      ৳{Number(item.monthlyFee || 0).toLocaleString("en-US")}
                    </td>
                    <td className="font-semibold text-base-content/65">
                      {formatDate(item.appliedAt || item.createdAt)}
                    </td>
                    <td>
                      <span
                        className={`badge badge-sm font-bold ${
                          STATUS_BADGE[item.status] || "badge-ghost"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="text-right">
                      {item.status === "pending" ? (
                        <button
                          type="button"
                          onClick={() => handleCancel(item)}
                          disabled={removingId === (item._id || item.id)}
                          className="btn btn-ghost btn-sm gap-1.5 font-bold text-error hover:bg-error/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          {removingId === (item._id || item.id)
                            ? "Cancelling…"
                            : "Cancel"}
                        </button>
                      ) : (
                        <span className="text-xs font-semibold text-base-content/40">
                          —
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="flex flex-col gap-4 md:hidden">
            {list.map((item) => (
              <div
                key={item._id || item.id}
                className="rounded-3xl border border-base-content/10 bg-base-100 p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      href={`/tuitions/${item.tuitionId}`}
                      className="block truncate font-extrabold hover:text-primary"
                    >
                      {item.tuitionTitle || "Tuition"}
                    </Link>
                    <p className="mt-0.5 text-xs font-semibold text-base-content/55">
                      {item.tutorName} · {item.tutorEmail}
                    </p>
                  </div>
                  <span
                    className={`badge badge-sm font-bold ${
                      STATUS_BADGE[item.status] || "badge-ghost"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-xs font-semibold text-base-content/65">
                  <span className="flex items-center gap-1.5">
                    <Banknote className="h-3.5 w-3.5 text-secondary" />
                    ৳{Number(item.monthlyFee || 0).toLocaleString("en-US")}/mo
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5 text-primary" />
                    {formatDate(item.appliedAt || item.createdAt)}
                  </span>
                </div>

                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/tuitions/${item.tuitionId}`}
                    className="btn btn-outline btn-sm flex-1 gap-1.5 font-bold"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> View
                  </Link>
                  {item.status === "pending" && (
                    <button
                      type="button"
                      onClick={() => handleCancel(item)}
                      disabled={removingId === (item._id || item.id)}
                      className="btn btn-ghost btn-sm flex-1 gap-1.5 font-bold text-error"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

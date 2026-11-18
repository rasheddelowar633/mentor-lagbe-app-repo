"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Mail,
  Phone,
  XCircle,
} from "lucide-react";
import { EmptyState, TableSkeleton } from "@/components/Skeletons";
import { apiFetch } from "@/lib/api";
import { pickList } from "@/lib/payload";

const STATUS_BADGE = {
  pending: "badge-warning",
  accepted: "badge-success",
  rejected: "badge-error",
};

const FILTERS = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "accepted", label: "Accepted" },
  { id: "rejected", label: "Rejected" },
];

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

const uid = (item) => item._id || item.id;

function StatusBadge({ status }) {
  return (
    <span
      className={`badge badge-sm font-bold ${
        STATUS_BADGE[status] || "badge-ghost"
      }`}
    >
      {status}
    </span>
  );
}

export default function ManageApplicantsPage() {
  const [applications, setApplications] = useState(null);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [decidingId, setDecidingId] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const payload = await apiFetch("/api/applications/received");
        if (!active) return;
        setApplications(pickList(payload));
        setError(null);
      } catch (err) {
        if (!active) return;
        setError(err.message);
        setApplications([]);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const handleDecide = async (application, status) => {
    const id = uid(application);
    if (!id || application.status !== "pending") return;
    setDecidingId(id);
    try {
      await apiFetch(`/api/applications/${id}`, {
        method: "PATCH",
        body: { status },
      });
      setApplications((prev) =>
        (prev || []).map((item) =>
          uid(item) === id ? { ...item, status } : item,
        ),
      );
      toast.success(
        `${application.studentName || "Student"} ${
          status === "accepted" ? "accepted" : "rejected"
        }.`,
      );
    } catch (err) {
      toast.error(err.message || "Could not update this application.");
    } finally {
      setDecidingId(null);
    }
  };

  if (applications === null && !error) {
    return (
      <div className="flex flex-col gap-6">
        <div className="skeleton h-8 w-72 rounded-lg" />
        <TableSkeleton rows={5} cols={6} />
      </div>
    );
  }

  const list = applications || [];
  const counts = {
    all: list.length,
    pending: list.filter((item) => item.status === "pending").length,
    accepted: list.filter((item) => item.status === "accepted").length,
    rejected: list.filter((item) => item.status === "rejected").length,
  };
  const visible =
    filter === "all" ? list : list.filter((item) => item.status === filter);

  const renderActions = (item) => {
    const id = uid(item);
    if (item.status !== "pending") return <StatusBadge status={item.status} />;
    const isDeciding = decidingId === id;
    return (
      <div className="flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={() => handleDecide(item, "accepted")}
          disabled={isDeciding}
          className="btn btn-outline btn-sm gap-1.5 font-bold text-success"
        >
          {isDeciding ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <CheckCircle2 className="h-3.5 w-3.5" />
          )}
          Accept
        </button>
        <button
          type="button"
          onClick={() => handleDecide(item, "rejected")}
          disabled={isDeciding}
          className="btn btn-ghost btn-sm gap-1.5 font-bold text-error hover:bg-error/10"
        >
          <XCircle className="h-3.5 w-3.5" />
          Reject
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Manage Applicants
          </h1>
          <p className="mt-1 text-sm text-base-content/60">
            Every student who applied to your tuition posts — accept the ones
            you want and politely decline the rest.
          </p>
        </div>
        <Link
          href="/dashboard/tutor/my-tuitions"
          className="btn-ghost-brand !py-2.5 text-sm"
        >
          My tuitions <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {error && (
        <div className="rounded-2xl border border-error/30 bg-error/10 px-4 py-3 text-sm font-semibold text-error">
          {error}
        </div>
      )}

      {list.length === 0 ? (
        <EmptyState
          title="No applicants yet"
          description="Students who apply to your approved tuition posts will appear here so you can accept or reject them."
          action={
            <Link href="/dashboard/tutor/post-tuition" className="btn-brand">
              Post a Tuition <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
      ) : (
        <>
          {/* Status filters */}
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                className={`btn btn-sm rounded-full font-extrabold ${
                  filter === item.id
                    ? "btn-primary"
                    : "btn-ghost border-base-content/15 text-base-content/60"
                }`}
              >
                {item.label} <span className="opacity-60">({counts[item.id]})</span>
              </button>
            ))}
          </div>

          {visible.length === 0 ? (
            <EmptyState
              title={`No ${filter} applicants`}
              description="There are no applications with this status right now."
              action={
                <button
                  type="button"
                  onClick={() => setFilter("all")}
                  className="btn-ghost-brand"
                >
                  Show all applicants <ArrowRight className="h-4 w-4" />
                </button>
              }
            />
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto rounded-3xl border border-base-content/10 bg-base-100 md:block">
                <table className="table">
                  <thead className="bg-base-200 text-xs font-extrabold uppercase tracking-widest text-base-content/60">
                    <tr>
                      <th>Student</th>
                      <th>Phone</th>
                      <th>Preferred schedule</th>
                      <th>Note</th>
                      <th>Tuition</th>
                      <th>Applied</th>
                      <th>Status</th>
                      <th className="text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {visible.map((item, index) => (
                      <tr key={uid(item) || `row-${index}`} className="border-base-content/10">
                        <td>
                          <span className="block font-extrabold">
                            {item.studentName || "Student"}
                          </span>
                          <span className="flex max-w-[170px] items-center gap-1.5 text-xs text-base-content/55">
                            <Mail className="h-3 w-3 shrink-0" />
                            <span className="truncate">
                              {item.studentEmail || "—"}
                            </span>
                          </span>
                        </td>
                        <td className="font-semibold text-base-content/65">
                          <span className="flex items-center gap-1.5">
                            <Phone className="h-3.5 w-3.5 text-primary" />
                            {item.studentPhone || "—"}
                          </span>
                        </td>
                        <td className="font-semibold text-base-content/65">
                          <span className="flex items-center gap-1.5">
                            <CalendarDays className="h-3.5 w-3.5 text-secondary" />
                            {item.preferredSchedule || "—"}
                          </span>
                        </td>
                        <td>
                          <p
                            className="max-w-[160px] truncate text-base-content/65"
                            title={item.studentNote || ""}
                          >
                            {item.studentNote || "—"}
                          </p>
                        </td>
                        <td>
                          {item.tuitionId ? (
                            <Link
                              href={`/tuitions/${item.tuitionId}`}
                              className="inline-flex items-center gap-1 font-extrabold text-base-content hover:text-primary"
                            >
                              <span className="max-w-[160px] truncate">
                                {item.tuitionTitle || "Tuition"}
                              </span>
                              <ExternalLink className="h-3 w-3 shrink-0" />
                            </Link>
                          ) : (
                            <span className="font-extrabold">
                              {item.tuitionTitle || "Tuition"}
                            </span>
                          )}
                          <p className="text-xs font-semibold text-base-content/50">
                            {item.subject || ""}
                          </p>
                        </td>
                        <td className="font-semibold text-base-content/65">
                          {formatDate(item.appliedAt || item.createdAt)}
                        </td>
                        <td>
                          <StatusBadge status={item.status} />
                        </td>
                        <td className="text-right">{renderActions(item)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="flex flex-col gap-4 md:hidden">
                {visible.map((item, index) => (
                  <div
                    key={uid(item) || `card-${index}`}
                    className="rounded-3xl border border-base-content/10 bg-base-100 p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-extrabold">
                          {item.studentName || "Student"}
                        </p>
                        <p className="mt-0.5 flex max-w-[70%] items-center gap-1.5 text-xs font-semibold text-base-content/55">
                          <Mail className="h-3 w-3 shrink-0" />
                          <span className="truncate">{item.studentEmail || "—"}</span>
                        </p>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>

                    <div className="mt-4 flex flex-col gap-2 text-xs font-semibold text-base-content/65">
                      <span className="flex items-start gap-1.5">
                        <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                        {item.studentPhone || "—"}
                      </span>
                      <span className="flex items-start gap-1.5">
                        <CalendarDays className="mt-0.5 h-3.5 w-3.5 shrink-0 text-secondary" />
                        {item.preferredSchedule || "No schedule preference"}
                      </span>
                      <span className="flex items-start gap-1.5">
                        <CalendarDays className="mt-0.5 h-3.5 w-3.5 shrink-0 text-info" />
                        Applied {formatDate(item.appliedAt || item.createdAt)}
                      </span>
                    </div>

                    <p className="mt-3 rounded-2xl border border-base-content/10 bg-base-200/60 px-3 py-2 text-xs font-semibold text-base-content/65">
                      {item.studentNote || "No note provided."}
                    </p>

                    <div className="mt-3 flex items-center justify-between gap-2 border-t border-base-content/10 pt-3">
                      <span className="truncate text-xs font-extrabold">
                        {item.tuitionTitle || "Tuition"}
                      </span>
                      {item.tuitionId && (
                        <Link
                          href={`/tuitions/${item.tuitionId}`}
                          className="inline-flex shrink-0 items-center gap-1 text-xs font-extrabold text-primary hover:underline"
                        >
                          View <ExternalLink className="h-3 w-3" />
                        </Link>
                      )}
                    </div>

                    {item.status === "pending" ? (
                      <div className="mt-4 flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleDecide(item, "accepted")}
                          disabled={decidingId === uid(item)}
                          className="btn btn-outline btn-sm flex-1 gap-1.5 font-bold text-success"
                        >
                          {decidingId === uid(item) ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          )}
                          Accept
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDecide(item, "rejected")}
                          disabled={decidingId === uid(item)}
                          className="btn btn-ghost btn-sm flex-1 gap-1.5 font-bold text-error"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          Reject
                        </button>
                      </div>
                    ) : (
                      <div className="mt-4 flex justify-end">
                        <StatusBadge status={item.status} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

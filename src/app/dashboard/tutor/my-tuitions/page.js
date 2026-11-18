"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowRight,
  Banknote,
  CalendarDays,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  Trash2,
  ToggleLeft,
} from "lucide-react";
import { EmptyState, TuitionGridSkeleton } from "@/components/Skeletons";
import { apiFetch } from "@/lib/api";
import { pickList } from "@/lib/payload";

const APPROVAL_BADGE = {
  pending: "badge-warning",
  approved: "badge-success",
  rejected: "badge-error",
};

const FILTERS = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
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

export default function MyTuitionsPage() {
  const [tuitions, setTuitions] = useState(null);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const payload = await apiFetch("/api/tuitions/my");
        if (!active) return;
        setTuitions(pickList(payload));
        setError(null);
      } catch (err) {
        if (!active) return;
        setError(err.message);
        setTuitions([]);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const handleToggle = async (tuition) => {
    const id = uid(tuition);
    if (!id) return;
    const nextActive = !(tuition.isActive ?? true);
    setTogglingId(id);
    try {
      await apiFetch(`/api/tuitions/${id}/status`, {
        method: "PATCH",
        body: { isActive: nextActive },
      });
      setTuitions((prev) =>
        (prev || []).map((item) =>
          uid(item) === id ? { ...item, isActive: nextActive } : item,
        ),
      );
      toast.success(`Tuition marked as ${nextActive ? "Active" : "Closed"}.`);
    } catch (err) {
      toast.error(err.message || "Could not update the tuition status.");
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (tuition) => {
    const id = uid(tuition);
    if (!id) return;
    const confirmed = window.confirm(
      `Delete "${tuition.title || "this tuition"}"? This cannot be undone.`,
    );
    if (!confirmed) return;

    setDeletingId(id);
    try {
      await apiFetch(`/api/tuitions/${id}`, { method: "DELETE" });
      setTuitions((prev) => (prev || []).filter((item) => uid(item) !== id));
      toast.success("Tuition deleted.");
    } catch (err) {
      toast.error(err.message || "Could not delete the tuition.");
    } finally {
      setDeletingId(null);
    }
  };

  if (tuitions === null && !error) {
    return (
      <div className="flex flex-col gap-6">
        <div className="skeleton h-8 w-72 rounded-lg" />
        <TuitionGridSkeleton count={6} />
      </div>
    );
  }

  const list = tuitions || [];
  const counts = {
    all: list.length,
    pending: list.filter((item) => item.approvalStatus === "pending").length,
    approved: list.filter((item) => item.approvalStatus === "approved").length,
    rejected: list.filter((item) => item.approvalStatus === "rejected").length,
  };
  const visible =
    filter === "all"
      ? list
      : list.filter((item) => item.approvalStatus === filter);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            My Created Tuitions
          </h1>
          <p className="mt-1 text-sm text-base-content/60">
            Edit, close or remove your tuition posts and keep track of each
            admin approval.
          </p>
        </div>
        <Link href="/dashboard/tutor/post-tuition" className="btn-brand !py-2.5 text-sm">
          <Plus className="h-4 w-4" /> Post a Tuition
        </Link>
      </div>

      {error && (
        <div className="rounded-2xl border border-error/30 bg-error/10 px-4 py-3 text-sm font-semibold text-error">
          {error}
        </div>
      )}

      {list.length === 0 ? (
        <EmptyState
          title="No tuitions yet"
          description="Create your first tuition batch — it will be reviewed by an admin and go live for students to apply."
          action={
            <Link href="/dashboard/tutor/post-tuition" className="btn-brand">
              <Plus className="h-4 w-4" /> Post a Tuition
            </Link>
          }
        />
      ) : (
        <>
          {/* Client-side approval filters */}
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
                {item.label}{" "}
                <span className="opacity-60">({counts[item.id]})</span>
              </button>
            ))}
          </div>

          {visible.length === 0 ? (
            <EmptyState
              title={`No ${filter} tuitions`}
              description="There are no tuition posts with this approval status right now."
              action={
                <button
                  type="button"
                  onClick={() => setFilter("all")}
                  className="btn-ghost-brand"
                >
                  Show all tuitions <ArrowRight className="h-4 w-4" />
                </button>
              }
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {visible.map((tuition, index) => {
                const id = uid(tuition);
                const isActive = tuition.isActive !== false;
                const busyToggling = togglingId === id;
                const busyDeleting = deletingId === id;
                const initial = (tuition.title || "?").charAt(0).toUpperCase();

                return (
                  <div
                    key={id || index}
                    className="flex flex-col overflow-hidden rounded-3xl border border-base-content/10 bg-base-100"
                  >
                    {/* Banner */}
                    <div className="relative h-32 shrink-0 bg-base-200">
                      {tuition.bannerImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={tuition.bannerImage}
                          alt={tuition.title || "Tuition banner"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="grid h-full w-full place-items-center bg-gradient-to-br from-primary/20 to-secondary/20 text-3xl font-extrabold text-primary">
                          {initial}
                        </span>
                      )}
                      <span
                        className={`badge badge-sm absolute left-3 top-3 font-bold shadow-sm ${
                          APPROVAL_BADGE[tuition.approvalStatus] || "badge-ghost"
                        }`}
                      >
                        {tuition.approvalStatus || "pending"}
                      </span>
                      <span
                        className={`badge badge-sm absolute right-3 top-3 font-bold shadow-sm ${
                          isActive ? "badge-success" : "badge-neutral"
                        }`}
                      >
                        {isActive ? "Active" : "Closed"}
                      </span>
                    </div>

                    {/* Body */}
                    <div className="flex flex-1 flex-col gap-3 p-5">
                      <div>
                        <h3 className="truncate font-extrabold">
                          {tuition.title || "Untitled tuition"}
                        </h3>
                        <p className="mt-0.5 truncate text-xs font-semibold text-base-content/55">
                          {[tuition.subject, tuition.classLevel, tuition.mode]
                            .filter(Boolean)
                            .join(" · ") || "—"}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs font-semibold text-base-content/60">
                        <span className="flex items-center gap-1.5">
                          <Banknote className="h-3.5 w-3.5 text-secondary" />
                          ৳{Number(tuition.monthlyFee || 0).toLocaleString("en-US")}
                          /mo
                        </span>
                        <span className="flex items-center gap-1.5">
                          <CalendarDays className="h-3.5 w-3.5 text-primary" />
                          {formatDate(tuition.createdAt)}
                        </span>
                        <span className="flex min-w-0 items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-info" />
                          <span className="truncate">
                            {tuition.mode === "Online"
                              ? "Online"
                              : tuition.location || tuition.mode || "—"}
                          </span>
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="mt-auto flex flex-wrap gap-2 border-t border-base-content/10 pt-4">
                        <Link
                          href={`/dashboard/tutor/my-tuitions/${id}/edit`}
                          className="btn btn-outline btn-sm gap-1.5 font-bold"
                        >
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleToggle(tuition)}
                          disabled={busyToggling || busyDeleting}
                          className="btn btn-ghost btn-sm gap-1.5 font-bold"
                        >
                          {busyToggling ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <ToggleLeft className="h-3.5 w-3.5" />
                          )}
                          {busyToggling
                            ? "Saving…"
                            : isActive
                              ? "Close"
                              : "Activate"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(tuition)}
                          disabled={busyDeleting || busyToggling}
                          className="btn btn-ghost btn-sm gap-1.5 font-bold text-error hover:bg-error/10"
                        >
                          {busyDeleting ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                          {busyDeleting ? "Deleting…" : "Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

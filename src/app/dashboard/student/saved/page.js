"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowRight, Bookmark, Trash2 } from "lucide-react";
import TuitionCard from "@/components/TuitionCard";
import { EmptyState, TuitionGridSkeleton } from "@/components/Skeletons";
import { apiFetch } from "@/lib/api";
import { pickList } from "@/lib/payload";

function normalise(items) {
  return items
    .map((item) => item?.tuition || item)
    .filter((item) => item && (item._id || item.id));
}

export default function SavedTuitionsPage() {
  const [tuitions, setTuitions] = useState(null);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    try {
      const payload = await apiFetch("/api/bookmarks/my");
      setTuitions(normalise(pickList(payload)));
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

  const handleRemove = async (tuition) => {
    const id = tuition._id || tuition.id;
    setBusyId(id);
    try {
      await apiFetch(`/api/bookmarks/${id}`, { method: "DELETE" });
      toast.success("Removed from saved tuitions.");
      setTuitions((prev) =>
        (prev || []).filter((item) => (item._id || item.id) !== id),
      );
    } catch (err) {
      toast.error(err.message || "Could not remove this tuition.");
    } finally {
      setBusyId(null);
    }
  };

  if (tuitions === null && !error) {
    return (
      <div className="flex flex-col gap-6">
        <div className="skeleton h-8 w-56 rounded-lg" />
        <TuitionGridSkeleton count={3} />
      </div>
    );
  }

  const list = tuitions || [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Saved Tuitions</h1>
          <p className="mt-1 text-sm text-base-content/60">
            Your bookmarked batches — come back and apply when you are ready.
          </p>
        </div>
        <Link href="/tuitions" className="btn-ghost-brand !py-2.5 text-sm">
          Browse tuitions <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {error && (
        <div className="rounded-2xl border border-error/30 bg-error/10 px-4 py-3 text-sm font-semibold text-error">
          {error}
        </div>
      )}

      {list.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No saved tuitions yet"
          description="Tap the bookmark on any tuition card to keep it here for later."
          action={
            <Link href="/tuitions" className="btn-brand">
              Find tuitions to save <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((tuition, index) => (
            <div key={tuition._id || tuition.id || index} className="relative">
              <TuitionCard tuition={tuition} />
              <button
                type="button"
                onClick={() => handleRemove(tuition)}
                disabled={busyId === (tuition._id || tuition.id)}
                aria-label="Remove from saved tuitions"
                className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-base-100/95 text-error shadow-lg transition-transform hover:scale-110"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

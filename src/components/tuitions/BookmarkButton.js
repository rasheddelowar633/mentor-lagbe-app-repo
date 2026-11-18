"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Bookmark } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { pickList } from "@/lib/payload";
import { useAuth } from "@/providers/AuthProvider";

/**
 * Shared, module-level cache so a grid of cards only requests
 * the bookmark list once per page load.
 */
const cache = { ids: new Set(), loaded: false, promise: null };

function loadSaved() {
  if (cache.loaded) return Promise.resolve(cache.ids);
  if (!cache.promise) {
    cache.promise = apiFetch("/api/bookmarks/my")
      .then((payload) => {
        pickList(payload).forEach((item) => {
          const tu = item?.tuition || item;
          const id = tu?._id || tu?.id;
          if (id) cache.ids.add(String(id));
        });
        cache.loaded = true;
        return cache.ids;
      })
      .catch(() => {
        cache.promise = null;
        return cache.ids;
      });
  }
  return cache.promise;
}

export default function BookmarkButton({ tuitionId, className = "" }) {
  const router = useRouter();
  const { isAuthenticated, role, loading } = useAuth();
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (loading || !isAuthenticated || role !== "student" || !tuitionId) return;
    let active = true;
    void loadSaved().then((ids) => {
      if (active) setSaved(ids.has(String(tuitionId)));
    });
    return () => {
      active = false;
    };
  }, [loading, isAuthenticated, role, tuitionId]);

  const handleToggle = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (loading) return;
    if (!isAuthenticated) {
      toast.info("Sign in as a student to save tuitions.");
      router.push("/sign-in");
      return;
    }
    if (role !== "student") {
      toast.info("Only student accounts can save tuitions.");
      return;
    }
    if (!tuitionId || busy) return;

    setBusy(true);
    const next = !saved;
    setSaved(next);
    try {
      if (next) {
        await apiFetch(`/api/bookmarks/${tuitionId}`, { method: "POST" });
        cache.ids.add(String(tuitionId));
        toast.success("Saved to your tuitions.");
      } else {
        await apiFetch(`/api/bookmarks/${tuitionId}`, { method: "DELETE" });
        cache.ids.delete(String(tuitionId));
        toast.success("Removed from saved tuitions.");
      }
    } catch (error) {
      setSaved(!next);
      toast.error(error.message || "Could not update your bookmark.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={busy}
      aria-label={saved ? "Remove bookmark" : "Save tuition"}
      aria-pressed={saved}
      className={`grid h-9 w-9 place-items-center rounded-full bg-base-100/95 shadow-lg transition-all hover:scale-110 disabled:opacity-60 ${
        saved ? "text-primary" : "text-base-content/60"
      } ${className}`}
    >
      <Bookmark
        className={`h-4 w-4 ${saved ? "fill-current" : ""}`}
        aria-hidden="true"
      />
    </button>
  );
}

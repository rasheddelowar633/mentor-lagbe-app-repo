"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";
import TuitionForm from "@/components/dashboard/TuitionForm";
import { apiFetch } from "@/lib/api";
import { pickOne } from "@/lib/payload";

export default function EditTuitionPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [tuition, setTuition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    let active = true;
    (async () => {
      try {
        const payload = await apiFetch(`/api/tuitions/${id}`);
        const record = pickOne(payload);
        if (active) {
          if (record && (record._id || record.id)) {
            setTuition(record);
            setError(null);
          } else {
            setError("This tuition could not be found.");
          }
        }
      } catch (err) {
        if (active) setError(err.message || "Could not load this tuition.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  const handleSubmit = async (values) => {
    if (!id) return;
    setSubmitting(true);
    try {
      await apiFetch(`/api/tuitions/${id}`, { method: "PATCH", body: values });
      toast.success("Tuition updated successfully.");
      router.push("/dashboard/tutor/my-tuitions");
    } catch (err) {
      toast.error(err.message || "Could not update the tuition.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="skeleton h-8 w-72 rounded-lg" />
        <div className="skeleton h-4 w-96 max-w-full rounded" />
        <div className="rounded-3xl border border-base-content/10 bg-base-100 p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="skeleton h-11 w-full rounded-lg" />
            ))}
            <div className="skeleton h-32 w-full rounded-lg sm:col-span-2" />
            <div className="skeleton h-32 w-full rounded-lg sm:col-span-2" />
          </div>
          <div className="mt-6 flex justify-end">
            <div className="skeleton h-11 w-40 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Edit Tuition</h1>
          <p className="mt-1 text-sm text-base-content/60">
            Update the batch details below — changes are re-checked by an admin
            before going live.
          </p>
        </div>
        <Link
          href="/dashboard/tutor/my-tuitions"
          className="btn-ghost-brand !py-2.5 text-sm"
        >
          Back to my tuitions <ChevronLeft className="h-4 w-4" />
        </Link>
      </div>

      {error && (
        <div className="rounded-2xl border border-error/30 bg-error/10 px-4 py-3 text-sm font-semibold text-error">
          {error}
        </div>
      )}

      {!error && tuition && (
        <div className="rounded-3xl border border-base-content/10 bg-base-100 p-6">
          <TuitionForm
            initialValue={tuition}
            submitLabel="Save Changes"
            onSubmit={handleSubmit}
            submitting={submitting}
          />
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AlertTriangle, ArrowRight } from "lucide-react";
import TuitionForm from "@/components/dashboard/TuitionForm";
import { apiFetch } from "@/lib/api";

export default function PostTuitionPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [limitError, setLimitError] = useState(null);

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      await apiFetch("/api/tuitions", { method: "POST", body: values });
      toast.success("Tuition submitted for admin approval.");
      router.push("/dashboard/tutor/my-tuitions");
    } catch (err) {
      if (err.status === 403) {
        setLimitError(
          err.message || "Free tutors can only post up to 2 tuitions.",
        );
        toast.error(err.message || "Free plan post limit reached.");
      } else {
        toast.error(err.message || "Could not post the tuition.");
      }
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Post a Tuition</h1>
        <p className="mt-1 text-sm text-base-content/60">
          Fill in the batch details below — once an admin approves it, students
          will be able to find and apply.
        </p>
      </div>

      {limitError && (
        <div className="alert alert-warning items-start gap-3 rounded-2xl text-sm font-semibold">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            {limitError} Free tutors can create up to 2 tuition posts — upgrade
            to the Pro plan for unlimited posts.{" "}
            <Link
              href="/pricing"
              className="font-extrabold underline hover:no-underline"
            >
              View pricing <ArrowRight className="inline h-3.5 w-3.5" />
            </Link>
          </span>
        </div>
      )}

      <div className="rounded-3xl border border-base-content/10 bg-base-100 p-6">
        <TuitionForm
          submitLabel="Post Tuition"
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      </div>
    </div>
  );
}

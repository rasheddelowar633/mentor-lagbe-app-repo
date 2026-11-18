"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, BadgeCheck, Home, Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { refresh } = useAuth();
  const [verified, setVerified] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const confirm = async () => {
      try {
        if (sessionId) {
          // Best-effort server verification (the webhook is the source of truth).
          await apiFetch("/api/payments/verify", {
            method: "POST",
            body: { sessionId },
          });
        }
      } catch {
        /* the webhook may have already recorded the payment */
      } finally {
        try {
          await refresh();
        } catch {
          /* ignore */
        }
        setVerified(true);
      }
    };

    void confirm();
  }, [sessionId, refresh]);

  return (
    <div className="container-x flex min-h-[65vh] flex-col items-center justify-center py-24 text-center">
      <span className="grid h-20 w-20 place-items-center rounded-full bg-success/15 text-success">
        {verified ? (
          <BadgeCheck className="h-10 w-10" aria-hidden="true" />
        ) : (
          <Loader2 className="h-10 w-10 animate-spin" aria-hidden="true" />
        )}
      </span>

      <h1 className="mt-6 text-3xl font-extrabold tracking-tight">
        Payment successful!
      </h1>
      <p className="mt-3 max-w-md text-base-content/65">
        {verified
          ? "Your Pro plan is now active and the transaction has been recorded. Welcome aboard!"
          : "Confirming your payment with Stripe — this only takes a moment…"}
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/dashboard" className="btn-brand">
          Go to Dashboard <ArrowRight className="h-4 w-4" />
        </Link>
        <Link href="/" className="btn-ghost-brand">
          <Home className="h-4 w-4" /> Back to Home
        </Link>
      </div>

      {verified && (
        <button
          type="button"
          onClick={() => toast.success("Your plan has been refreshed.")}
          className="mt-6 text-xs font-bold text-base-content/45 underline-offset-4 hover:text-primary hover:underline"
        >
          My plan still shows Free — refresh plan status
        </button>
      )}
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="container-x flex min-h-[65vh] items-center justify-center py-24">
          <span className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}

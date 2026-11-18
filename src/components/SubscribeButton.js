"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Zap } from "lucide-react";
import { createCheckoutSession } from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";

/** Stripe Checkout CTA used on the pricing page and the home page. */
export default function SubscribeButton({
  planId,
  planRole,
  label = "Subscribe with Stripe",
  className = "",
}) {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading, role } = useAuth();
  const [pending, setPending] = useState(false);

  const handleSubscribe = async () => {
    if (authLoading || pending) return;

    if (!isAuthenticated) {
      toast.info("Please sign in first to upgrade your plan.");
      router.push("/sign-in");
      return;
    }

    setPending(true);
    try {
      const url = await createCheckoutSession(planId, {
        role: planRole || role,
      });
      if (!url) throw new Error("Stripe checkout session was not created.");
      window.location.href = url;
    } catch (error) {
      toast.error(error.message || "Could not start checkout. Please try again.");
      setPending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSubscribe}
      disabled={pending}
      className={`btn-brand w-full ${className}`}
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" /> Redirecting to Stripe…
        </>
      ) : (
        <>
          <Zap className="h-4 w-4" /> {label}
        </>
      )}
    </button>
  );
}

import Link from "next/link";
import { ArrowRight, XCircle } from "lucide-react";

export const metadata = {
  title: "Payment Cancelled",
};

export default function PaymentCancelPage() {
  return (
    <div className="container-x flex min-h-[65vh] flex-col items-center justify-center py-24 text-center">
      <span className="grid h-20 w-20 place-items-center rounded-full bg-error/10 text-error">
        <XCircle className="h-10 w-10" aria-hidden="true" />
      </span>

      <h1 className="mt-6 text-3xl font-extrabold tracking-tight">
        Payment cancelled
      </h1>
      <p className="mt-3 max-w-md text-base-content/65">
        No money was charged. You can review the plans and try again whenever you
        are ready — your Free plan keeps working exactly as before.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/pricing" className="btn-brand">
          Back to Pricing <ArrowRight className="h-4 w-4" />
        </Link>
        <Link href="/" className="btn-ghost-brand">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

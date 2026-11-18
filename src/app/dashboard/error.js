"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export default function DashboardError({ error, retry }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <span className="grid h-16 w-16 place-items-center rounded-2xl bg-error/10 text-error">
        <AlertTriangle className="h-8 w-8" aria-hidden="true" />
      </span>
      <h1 className="mt-6 text-2xl font-extrabold tracking-tight">
        Dashboard error
      </h1>
      <p className="mt-3 max-w-md text-sm text-base-content/65">
        We could not load this part of your dashboard. Check that the MentorLagbe
        API is running, then try again.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={() => retry()} className="btn-brand">
          <RefreshCw className="h-4 w-4" /> Try Again
        </button>
        <Link href="/" className="btn-ghost-brand">
          <Home className="h-4 w-4" /> Back to Home
        </Link>
      </div>
    </div>
  );
}

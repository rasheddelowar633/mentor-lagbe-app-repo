"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export default function ErrorPage({ error, retry }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-x flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-2xl bg-error/10 text-error">
        <AlertTriangle className="h-8 w-8" aria-hidden="true" />
      </span>
      <h1 className="mt-6 text-3xl font-extrabold tracking-tight">
        Something went wrong
      </h1>
      <p className="mt-3 max-w-md text-base-content/65">
        An unexpected error occurred while loading this page. Please try again —
        if the problem keeps happening, come back a little later.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
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

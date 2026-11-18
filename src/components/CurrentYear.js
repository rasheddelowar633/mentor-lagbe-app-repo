"use client";

import { useEffect, useState } from "react";

/** Renders the current year on the client to keep the footer prerender-safe. */
export default function CurrentYear() {
  const [year, setYear] = useState("");

  useEffect(() => {
    /* Defer past hydration so `new Date()` never runs while prerendering. */
    const timer = setTimeout(() => setYear(String(new Date().getFullYear())), 0);
    return () => clearTimeout(timer);
  }, []);

  return <span suppressHydrationWarning>{year}</span>;
}

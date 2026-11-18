"use client";

import { useEffect, useState } from "react";

/** Renders the current year on the client to keep the footer prerender-safe. */
export default function CurrentYear() {
  const [year, setYear] = useState("");

  useEffect(() => {
    setYear(String(new Date().getFullYear()));
  }, []);

  return <span suppressHydrationWarning>{year}</span>;
}

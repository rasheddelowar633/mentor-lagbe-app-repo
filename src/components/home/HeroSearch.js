"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { SUBJECTS } from "@/lib/constants";

export default function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const submit = (event) => {
    event.preventDefault();
    const trimmed = query.trim();
    router.push(trimmed ? `/tuitions?search=${encodeURIComponent(trimmed)}` : "/tuitions");
  };

  return (
    <form onSubmit={submit} className="mt-8" role="search">
      <div className="flex flex-col gap-3 rounded-2xl border border-base-content/10 bg-base-100/80 p-2 shadow-xl shadow-primary/10 backdrop-blur sm:flex-row sm:items-center">
        <label htmlFor="hero-search" className="sr-only">
          Search tuitions
        </label>
        <input
          id="hero-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search subject, class or tuition title…"
          className="field-input !border-0 !bg-transparent !shadow-none focus:!shadow-none"
        />
        <button type="submit" className="btn-brand shrink-0 !py-3">
          <Search className="h-4 w-4" /> Search
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-base-content/55">
        <span>Popular:</span>
        {["Mathematics", "Physics", "Programming", "IELTS"].map((subject) => (
          <button
            key={subject}
            type="button"
            onClick={() => router.push(`/tuitions?search=${encodeURIComponent(subject)}`)}
            className="rounded-full border border-base-content/15 px-3 py-1 transition-colors hover:border-primary hover:text-primary"
          >
            {subject}
          </button>
        ))}
        <span className="hidden sm:inline">·</span>
        <span className="hidden sm:inline">
          {SUBJECTS.length}+ subjects available
        </span>
      </div>
    </form>
  );
}

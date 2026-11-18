"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FilterX, Search } from "lucide-react";
import { CLASS_LEVELS, MODES, SUBJECTS } from "@/lib/constants";

/**
 * Server-side search & filter controls (Challenge 1).
 * Every change is written to the URL query string, so the server component
 * re-queries MongoDB with the new search / filter values.
 */
export default function TuitionsFilter({ resultCount }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");

  /* Follow URL changes (back/forward) — adjusted during render. */
  const urlSearch = searchParams.get("search") || "";
  const [appliedUrlSearch, setAppliedUrlSearch] = useState(urlSearch);
  if (urlSearch !== appliedUrlSearch) {
    setAppliedUrlSearch(urlSearch);
    setSearch(urlSearch);
  }

  const applyParams = (updates, { resetPage = true } = {}) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    if (resetPage) params.delete("page");
    const query = params.toString();
    router.replace(query ? `/tuitions?${query}` : "/tuitions", { scroll: false });
  };

  const hasFilters =
    searchParams.get("search") ||
    searchParams.get("subject") ||
    searchParams.get("classLevel") ||
    searchParams.get("mode");

  return (
    <div className="rounded-3xl border border-base-content/10 bg-base-200/70 p-4 sm:p-5">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          applyParams({ search: search.trim() });
        }}
        className="flex flex-col gap-3 lg:flex-row"
      >
        <label htmlFor="tuition-search" className="sr-only">
          Search tuitions
        </label>
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-base-content/45"
            aria-hidden="true"
          />
          <input
            id="tuition-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by title or subject…"
            className="field-input !pl-10"
          />
        </div>

        <select
          aria-label="Filter by subject"
          className="field-input lg:w-52"
          value={searchParams.get("subject") || ""}
          onChange={(event) => applyParams({ subject: event.target.value })}
        >
          <option value="">All subjects</option>
          {SUBJECTS.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>

        <select
          aria-label="Filter by class level"
          className="field-input lg:w-48"
          value={searchParams.get("classLevel") || ""}
          onChange={(event) => applyParams({ classLevel: event.target.value })}
        >
          <option value="">All classes</option>
          {CLASS_LEVELS.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>

        <select
          aria-label="Filter by mode"
          className="field-input lg:w-40"
          value={searchParams.get("mode") || ""}
          onChange={(event) => applyParams({ mode: event.target.value })}
        >
          <option value="">Online & Offline</option>
          {MODES.map((mode) => (
            <option key={mode} value={mode}>
              {mode}
            </option>
          ))}
        </select>

        <button type="submit" className="btn-brand shrink-0 !py-3">
          Search
        </button>
      </form>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-base-content/60">
        <span>
          {typeof resultCount === "number"
            ? `${resultCount} tuition${resultCount === 1 ? "" : "s"} found`
            : "Results update automatically"}
        </span>
        {hasFilters && (
          <button
            type="button"
            onClick={() => router.replace("/tuitions", { scroll: false })}
            className="inline-flex items-center gap-1.5 rounded-full border border-base-content/15 px-3 py-1 transition-colors hover:border-error hover:text-error"
          >
            <FilterX className="h-3.5 w-3.5" /> Clear filters
          </button>
        )}
      </div>
    </div>
  );
}

import { Suspense } from "react";
import Link from "next/link";
import { BookOpen, GraduationCap, SearchX } from "lucide-react";
import TuitionCard from "@/components/TuitionCard";
import TuitionsFilter from "@/components/tuitions/TuitionsFilter";
import Pagination from "@/components/tuitions/Pagination";
import { EmptyState } from "@/components/Skeletons";
import Reveal from "@/components/Reveal";
import { apiFetch } from "@/lib/api";
import { pickList, pickPagination } from "@/lib/payload";

export const metadata = {
  title: "Browse Tuitions",
  description:
    "Search and filter admin-approved tuition batches by subject, class level, mode (Online/Offline) and monthly budget.",
};

const PAGE_SIZE = 12;

async function getTuitions(query) {
  try {
    const params = new URLSearchParams();
    if (query.search) params.set("search", query.search);
    if (query.subject) params.set("subject", query.subject);
    if (query.classLevel) params.set("classLevel", query.classLevel);
    if (query.mode) params.set("mode", query.mode);
    params.set("page", String(query.page));
    params.set("limit", String(PAGE_SIZE));

    const payload = await apiFetch(`/api/tuitions?${params.toString()}`, {
      auth: false,
    });

    return {
      tuitions: pickList(payload),
      ...pickPagination(payload, query.page, PAGE_SIZE),
    };
  } catch {
    return { tuitions: [], total: 0, page: query.page, pages: 1 };
  }
}

export default async function BrowseTuitionsPage({ searchParams }) {
  const sp = await searchParams;

  const query = {
    search: typeof sp.search === "string" ? sp.search.trim() : "",
    subject: typeof sp.subject === "string" ? sp.subject : "",
    classLevel: typeof sp.classLevel === "string" ? sp.classLevel : "",
    mode: typeof sp.mode === "string" ? sp.mode : "",
    page: Math.max(1, Number(sp.page) || 1),
  };

  const { tuitions, total, pages } = await getTuitions(query);

  const baseQuery = {
    ...(query.search && { search: query.search }),
    ...(query.subject && { subject: query.subject }),
    ...(query.classLevel && { classLevel: query.classLevel }),
    ...(query.mode && { mode: query.mode }),
  };

  const hasFilters = Boolean(
    query.search || query.subject || query.classLevel || query.mode,
  );

  return (
    <div className="container-x py-12 md:py-16">
      {/* Page header */}
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="section-eyebrow">
            <BookOpen className="h-3.5 w-3.5" /> Browse tuitions
          </span>
          <h1 className="section-title mt-4">
            Find a batch that fits your{" "}
            <span className="text-gradient">schedule &amp; budget</span>
          </h1>
          <p className="section-subtitle mt-3">
            Only listings with{" "}
            <strong className="text-base-content">approved</strong> status and{" "}
            <strong className="text-base-content">active</strong> posts are shown
            here.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-base-content/10 bg-base-200/70 px-4 py-3 text-sm font-bold">
          <GraduationCap className="h-4 w-4 text-primary" />
          {hasFilters ? `${total} matching result${total === 1 ? "" : "s"}` : `${total} live tuitions`}
        </div>
      </div>

      {/* Server-side search & filter (Challenge 1) */}
      <div className="mt-8">
        <Suspense fallback={<div className="skeleton h-32 w-full rounded-3xl" />}>
          <TuitionsFilter resultCount={tuitions.length} />
        </Suspense>
      </div>

      {/* Results */}
      <div className="mt-10">
        {tuitions.length > 0 ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tuitions.map((tuition, index) => (
                <Reveal
                  key={tuition._id || tuition.id || index}
                  delay={(index % 3) * 80}
                >
                  <TuitionCard tuition={tuition} />
                </Reveal>
              ))}
            </div>

            <Pagination page={query.page} pages={pages} baseQuery={baseQuery} />
          </>
        ) : (
          <EmptyState
            icon={SearchX}
            title={hasFilters ? "No tuitions match your filters" : "No tuitions published yet"}
            description={
              hasFilters
                ? "Try removing a filter or searching for a different subject — new batches are approved every day."
                : "Approved tuition batches will appear here as soon as tutors post them and the admin reviews them."
            }
            action={
              hasFilters ? (
                <Link href="/tuitions" className="btn-ghost-brand">
                  Clear all filters
                </Link>
              ) : (
                <a href="/sign-up?role=tutor" className="btn-brand">
                  Post a tuition
                </a>
              )
            }
          />
        )}
      </div>
    </div>
  );
}

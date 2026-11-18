import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

function buildHref(baseQuery, page) {
  const params = new URLSearchParams(baseQuery);
  if (page > 1) params.set("page", String(page));
  else params.delete("page");
  const query = params.toString();
  return query ? `/tuitions?${query}` : "/tuitions";
}

function pageWindow(page, pages) {
  const windowSize = 5;
  let start = Math.max(1, page - Math.floor(windowSize / 2));
  const end = Math.min(pages, start + windowSize - 1);
  start = Math.max(1, end - windowSize + 1);

  const numbers = [];
  for (let index = start; index <= end; index += 1) numbers.push(index);
  return numbers;
}

/** Server-rendered pagination (uses .skip()/.limit() on the API side). */
export default function Pagination({ page = 1, pages = 1, baseQuery = {} }) {
  if (pages <= 1) return null;

  const numbers = pageWindow(page, pages);

  return (
    <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Pagination">
      <Link
        href={buildHref(baseQuery, Math.max(1, page - 1))}
        aria-disabled={page <= 1}
        className={`btn btn-sm gap-1 rounded-lg border border-base-content/15 font-bold ${
          page <= 1 ? "pointer-events-none opacity-40" : "btn-ghost"
        }`}
      >
        <ChevronLeft className="h-4 w-4" /> Previous
      </Link>

      {numbers[0] > 1 && (
        <>
          <Link
            href={buildHref(baseQuery, 1)}
            className="btn btn-sm btn-ghost rounded-lg font-bold"
          >
            1
          </Link>
          {numbers[0] > 2 && <span className="px-1 text-base-content/40">…</span>}
        </>
      )}

      {numbers.map((number) => (
        <Link
          key={number}
          href={buildHref(baseQuery, number)}
          aria-current={number === page ? "page" : undefined}
          className={`btn btn-sm min-w-9 rounded-lg font-bold ${
            number === page
              ? "btn-primary"
              : "btn-ghost border border-base-content/10"
          }`}
        >
          {number}
        </Link>
      ))}

      {numbers[numbers.length - 1] < pages && (
        <>
          {numbers[numbers.length - 1] < pages - 1 && (
            <span className="px-1 text-base-content/40">…</span>
          )}
          <Link
            href={buildHref(baseQuery, pages)}
            className="btn btn-sm btn-ghost rounded-lg font-bold"
          >
            {pages}
          </Link>
        </>
      )}

      <Link
        href={buildHref(baseQuery, Math.min(pages, page + 1))}
        aria-disabled={page >= pages}
        className={`btn btn-sm gap-1 rounded-lg border border-base-content/15 font-bold ${
          page >= pages ? "pointer-events-none opacity-40" : "btn-ghost"
        }`}
      >
        Next <ChevronRight className="h-4 w-4" />
      </Link>
    </nav>
  );
}

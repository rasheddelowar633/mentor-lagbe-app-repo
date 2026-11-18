import { Inbox } from "lucide-react";

export function Spinner({ className = "" }) {
  return (
    <span
      className={`inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
      aria-hidden="true"
    />
  );
}

export function TuitionCardSkeleton() {
  return (
    <div className="card-brand animate-pulse !shadow-none">
      <div className="h-40 shrink-0 bg-base-300" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="skeleton h-3 w-20 rounded" />
        <div className="skeleton h-5 w-full rounded" />
        <div className="skeleton h-5 w-3/4 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
        <div className="mt-auto flex items-center justify-between pt-4">
          <div className="skeleton h-7 w-24 rounded" />
          <div className="skeleton h-9 w-28 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function TuitionGridSkeleton({ count = 6 }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <TuitionCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function StatCardSkeleton({ count = 4 }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="stat-card animate-pulse">
          <div className="skeleton h-4 w-24 rounded" />
          <div className="skeleton mt-3 h-8 w-16 rounded" />
          <div className="skeleton mt-3 h-3 w-32 rounded" />
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 6, cols = 4 }) {
  return (
    <div className="overflow-hidden rounded-box border border-base-content/10">
      <div className="h-12 bg-base-200" />
      <div className="divide-y divide-base-content/10 bg-base-100">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex gap-4 p-4">
            {Array.from({ length: cols }).map((_, colIndex) => (
              <div
                key={colIndex}
                className={`skeleton h-4 rounded ${
                  colIndex === 0 ? "w-40" : colIndex === cols - 1 ? "w-20" : "flex-1"
                }`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function EmptyState({
  title = "Nothing here yet",
  description = "Once there is data to show, it will appear here.",
  action = null,
  icon: Icon = Inbox,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-box border border-dashed border-base-content/20 bg-base-200/50 px-6 py-16 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
        <Icon className="h-7 w-7" aria-hidden="true" />
      </span>
      <h3 className="mt-4 text-lg font-extrabold">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-base-content/60">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function PageLoading({ label = "Loading…" }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
      <Spinner className="h-8 w-8 text-primary" />
      <p className="text-sm font-semibold text-base-content/60">{label}</p>
    </div>
  );
}

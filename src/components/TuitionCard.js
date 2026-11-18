import Link from "next/link";
import {
  Banknote,
  CalendarDays,
  MapPin,
  Monitor,
  Home,
  UserRound,
} from "lucide-react";
import { resolveImageUrl } from "@/lib/api";

function subjectInitial(subject) {
  return (subject || "T").charAt(0).toUpperCase();
}

/**
 * Tuition listing card — every card has the same height and width inside a grid.
 */
export default function TuitionCard({ tuition }) {
  if (!tuition) return null;

  const {
    _id,
    title,
    subject,
    classLevel,
    mode,
    location,
    monthlyFee,
    daysPerWeek,
    tutorName,
    bannerImage,
  } = tuition;

  const image = resolveImageUrl(bannerImage);

  return (
    <article className="card-brand group">
      {/* Banner */}
      <div className="relative h-40 shrink-0 overflow-hidden bg-base-300">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={title || subject || "Tuition banner"}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-gradient-to-br from-primary/85 via-primary/60 to-secondary/70">
            <span className="text-5xl font-extrabold text-white/90">
              {subjectInitial(subject)}
            </span>
          </div>
        )}

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <span
            className={`badge badge-sm font-bold ${
              mode === "Online" ? "badge-info" : "badge-secondary"
            }`}
          >
            {mode === "Online" ? (
              <Monitor className="mr-1 h-3 w-3" />
            ) : (
              <Home className="mr-1 h-3 w-3" />
            )}
            {mode}
          </span>
          <span className="badge badge-sm font-bold badge-neutral">
            {classLevel}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <span className="text-xs font-extrabold uppercase tracking-widest text-primary">
          {subject}
        </span>

        <h3 className="mt-2 line-clamp-2 text-base font-extrabold leading-snug text-base-content transition-colors group-hover:text-primary">
          {title}
        </h3>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-semibold text-base-content/60">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5 text-primary" />
            {daysPerWeek} days/week
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            <span className="max-w-[9rem] truncate">
              {location || (mode === "Online" ? "Online" : "On-site")}
            </span>
          </span>
        </div>

        <div className="mt-4 flex items-center gap-2 border-t border-dashed border-base-content/15 pt-4 text-xs font-semibold text-base-content/70">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-secondary/15 text-secondary">
            <UserRound className="h-3.5 w-3.5" />
          </span>
          <span className="truncate">{tutorName || "Verified Tutor"}</span>
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wide text-base-content/45">
              Monthly fee
            </span>
            <span className="flex items-baseline gap-1 text-xl font-extrabold text-base-content">
              <Banknote className="h-4 w-4 text-secondary" />
              ৳{Number(monthlyFee || 0).toLocaleString("en-US")}
            </span>
          </div>
          <Link
            href={`/tuitions/${_id}`}
            className="btn-brand !px-4 !py-2 text-xs"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}

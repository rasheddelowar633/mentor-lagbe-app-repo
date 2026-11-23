
import Link from "next/link";
import {
  Banknote,
  CalendarDays,
  MapPin,
  Monitor,
  Home,
  UserRound,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

import { resolveImageUrl } from "@/lib/api";
import BookmarkButton from "@/components/tuitions/BookmarkButton";

function subjectInitial(subject) {
  return (subject || "T").charAt(0).toUpperCase();
}

/**
 * Premium tuition listing card.
 * Consistent dimensions and centered grid alignment.
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
    <article
      className="
        group relative mx-auto flex h-full w-full
        max-w-[390px] flex-col overflow-hidden
        rounded-3xl border border-base-content/10
        bg-base-100 shadow-sm
        transition-all duration-500
        hover:-translate-y-2
        hover:border-primary/30
        hover:shadow-xl hover:shadow-primary/10
      "
    >
      {/* Banner */}
      <div className="relative h-48 shrink-0 overflow-hidden bg-base-200">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={title || subject || "Tuition banner"}
            loading="lazy"
            className="
              h-full w-full object-cover
              transition-transform duration-700
              group-hover:scale-110
            "
          />
        ) : (
          <div
            className="
              grid h-full w-full place-items-center
              bg-gradient-to-br from-primary via-primary/80 to-secondary
            "
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/30 bg-white/15 text-5xl font-black text-white shadow-xl backdrop-blur-sm">
              {subjectInitial(subject)}
            </div>
          </div>
        )}

        {/* Image overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

        {/* Top badges */}
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span
            className={`
              inline-flex items-center gap-1.5 rounded-full
              px-3 py-1.5 text-[11px] font-bold
              shadow-lg backdrop-blur-md
              ${
                mode === "Online"
                  ? "bg-blue-500/90 text-white"
                  : "bg-emerald-500/90 text-white"
              }
            `}
          >
            {mode === "Online" ? (
              <Monitor className="h-3.5 w-3.5" />
            ) : (
              <Home className="h-3.5 w-3.5" />
            )}
            {mode || "Flexible"}
          </span>

          <span className="rounded-full border border-white/30 bg-black/40 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur-md">
            {classLevel || "All Levels"}
          </span>
        </div>

        {/* Bookmark */}
        <BookmarkButton
          tuitionId={tuition?._id || tuition?.id}
          className="absolute right-4 top-4 rounded-full bg-white/90 shadow-lg backdrop-blur-md transition-transform hover:scale-110"
        />

        {/* Subject label */}
        <div className="absolute bottom-4 left-4">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            {subject || "General"}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {/* Title */}
        <h3
          className="
            line-clamp-2 min-h-[3.5rem]
            text-lg font-extrabold leading-7
            tracking-tight text-base-content
            transition-colors duration-300
            group-hover:text-primary
          "
        >
          {title || "Untitled Tuition Batch"}
        </h3>

        {/* Details */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="flex min-w-0 items-center gap-2 rounded-xl bg-base-200/70 p-3">
            <CalendarDays className="h-4 w-4 shrink-0 text-primary" />
            <span className="truncate text-xs font-semibold text-base-content/70">
              {daysPerWeek || 0} days/week
            </span>
          </div>

          <div className="flex min-w-0 items-center gap-2 rounded-xl bg-base-200/70 p-3">
            <MapPin className="h-4 w-4 shrink-0 text-primary" />
            <span className="truncate text-xs font-semibold text-base-content/70">
              {location || (mode === "Online" ? "Online" : "On-site")}
            </span>
          </div>
        </div>

        {/* Tutor Information */}
        <div className="mt-5 flex items-center gap-3 border-t border-base-content/10 pt-4">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
            <UserRound className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <span className="block text-[10px] font-bold uppercase tracking-widest text-base-content/45">
              Your Mentor
            </span>
            <span className="block truncate text-sm font-bold text-base-content">
              {tutorName || "Verified Tutor"}
            </span>
          </div>

          <span className="rounded-full bg-success/10 px-2.5 py-1 text-[10px] font-bold text-success">
            Verified
          </span>
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-base-content/10 pt-5">
          <div className="min-w-0">
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-base-content/45">
              Monthly Fee
            </span>

            <div className="flex items-center gap-1.5">
              <Banknote className="h-5 w-5 text-secondary" />
              <span className="text-xl font-black tracking-tight text-base-content">
                ৳{Number(monthlyFee || 0).toLocaleString("en-US")}
              </span>
            </div>
          </div>

          <Link
            href={`/tuitions/${_id}`}
            className="
              btn-brand group/btn
              inline-flex shrink-0 items-center gap-2
              !rounded-xl !px-4 !py-3
              text-xs font-bold
              shadow-md shadow-primary/15
              transition-all duration-300
              hover:shadow-lg hover:shadow-primary/25
            "
          >
            View Details
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}

import Link from "next/link";
import { GraduationCap } from "lucide-react";

/**
 * Brand logo used with the exact same style in the navbar, footer and hero,
 * so headings stay consistent across the whole site.
 */
export default function Logo({ href = "/", compact = false, className = "" }) {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-2.5 ${className}`}
      aria-label="MentorLagbe home"
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-content shadow-lg shadow-primary/30 transition-transform group-hover:-translate-y-0.5">
        <GraduationCap className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-xl font-extrabold tracking-tight text-base-content">
          Mentor<span className="text-primary">Lagbe</span>
        </span>
        {!compact && (
          <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-base-content/50">
            Tuition &amp; Mentorship
          </span>
        )}
      </span>
    </Link>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  Banknote,
  BookOpen,
  CalendarDays,
  Clock,
  Home,
  Mail,
  MapPin,
  Monitor,
  UserRound,
} from "lucide-react";
import ApplyPanel from "@/components/tuitions/ApplyPanel";
import { apiFetch, resolveImageUrl } from "@/lib/api";
import { pickOne } from "@/lib/payload";

export const metadata = {
  title: "Tuition Details",
  description: "Full details of a tuition batch on MentorLagbe.",
};

async function getTuition(id) {
  try {
    const payload = await apiFetch(`/api/tuitions/${id}`, { auth: false });
    return pickOne(payload);
  } catch {
    return null;
  }
}

function formatDate(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

export default async function TuitionDetailsPage({ params }) {
  const { id } = await params;
  const tuition = await getTuition(id);

  if (!tuition) notFound();

  const image = resolveImageUrl(tuition.bannerImage);
  const mode = tuition.mode || "Online";

  const facts = [
    { icon: BookOpen, label: "Subject", value: tuition.subject },
    { icon: Home, label: "Class level", value: tuition.classLevel },
    {
      icon: mode === "Online" ? Monitor : Home,
      label: "Mode",
      value: mode,
    },
    {
      icon: MapPin,
      label: "Location",
      value: tuition.location || (mode === "Online" ? "Online (anywhere)" : "Tutor's place"),
    },
    {
      icon: CalendarDays,
      label: "Days / week",
      value: tuition.daysPerWeek ? `${tuition.daysPerWeek} days` : "—",
    },
    {
      icon: Clock,
      label: "Posted on",
      value: formatDate(tuition.createdAt),
    },
  ];

  return (
    <div className="container-x py-10 md:py-14">
      <Link
        href="/tuitions"
        className="inline-flex items-center gap-2 text-sm font-bold text-base-content/60 transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Back to all tuitions
      </Link>

      {/* Banner */}
      <div className="relative mt-5 h-56 overflow-hidden rounded-3xl bg-base-300 md:h-72">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={tuition.title || "Tuition banner"}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-gradient-to-br from-primary via-primary/80 to-secondary">
            <span className="text-7xl font-extrabold text-white/90">
              {(tuition.subject || "T").charAt(0)}
            </span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5">
          <div className="flex flex-wrap gap-2">
            <span className="badge badge-primary badge-lg font-bold">
              {tuition.subject}
            </span>
            <span className="badge badge-lg border-none bg-white/90 font-bold text-neutral">
              {tuition.classLevel}
            </span>
            <span
              className={`badge badge-lg font-bold ${
                mode === "Online" ? "badge-info" : "badge-secondary"
              }`}
            >
              {mode}
            </span>
            {tuition.isActive !== false && (
              <span className="badge badge-lg badge-success font-bold">Active</span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2">
          <h1 className="text-[clamp(1.6rem,1.1rem+2vw,2.4rem)] font-extrabold leading-tight tracking-tight">
            {tuition.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold text-base-content/60">
            <span className="inline-flex items-center gap-1.5">
              <BadgeCheck className="h-4 w-4 text-success" /> Admin approved
            </span>
            <span className="inline-flex items-center gap-1.5">
              <UserRound className="h-4 w-4 text-primary" />
              {tuition.tutorName || "Verified tutor"}
            </span>
          </div>

          {/* Facts grid */}
          <dl className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {facts.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-start gap-3 rounded-2xl border border-base-content/10 bg-base-200/60 p-4"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <dt className="text-[11px] font-bold uppercase tracking-widest text-base-content/50">
                    {label}
                  </dt>
                  <dd className="truncate text-sm font-extrabold">{value || "—"}</dd>
                </span>
              </div>
            ))}
          </dl>

          {/* Description */}
          <div className="mt-8 rounded-3xl border border-base-content/10 bg-base-100 p-6">
            <h2 className="text-lg font-extrabold">About this batch</h2>
            <div className="mt-3 whitespace-pre-line text-sm leading-relaxed text-base-content/70">
              {tuition.description ||
                "The tutor has not added a description for this batch yet."}
            </div>
          </div>

          {/* Tutor summary */}
          <div className="mt-6 flex flex-col gap-4 rounded-3xl border border-base-content/10 bg-base-100 p-6 sm:flex-row sm:items-center">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-secondary/15 text-lg font-extrabold text-secondary">
              {(tuition.tutorName || "T").charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="flex flex-wrap items-center gap-2 text-base font-extrabold">
                {tuition.tutorName || "Verified Tutor"}
                <span className="badge badge-secondary badge-sm font-bold">Tutor</span>
              </h3>
              <p className="mt-1 flex items-center gap-1.5 truncate text-sm font-medium text-base-content/60">
                <Mail className="h-3.5 w-3.5 shrink-0 text-primary" />
                {tuition.tutorEmail || "tutor@mentorlagbe.com"}
              </p>
            </div>
            <Link
              href={`/tuitions?search=${encodeURIComponent(tuition.tutorName || "")}`}
              className="btn-ghost-brand !py-2 text-sm"
            >
              More from this tutor
            </Link>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="lg:sticky lg:top-24">
            <div className="mb-6 rounded-3xl border border-base-content/10 bg-neutral p-6 text-neutral-content">
              <span className="text-xs font-bold uppercase tracking-widest opacity-70">
                Monthly fee
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <Banknote className="h-6 w-6 text-accent" aria-hidden="true" />
                <span className="text-4xl font-extrabold tracking-tight">
                  ৳{Number(tuition.monthlyFee || 0).toLocaleString("en-US")}
                </span>
              </div>
              <p className="mt-3 text-xs font-semibold opacity-70">
                {mode === "Online"
                  ? "Live online sessions · flexible timing"
                  : "Home tuition · travel included in fee"}
              </p>
            </div>

            <ApplyPanel tuition={tuition} />
          </div>
        </aside>
      </div>
    </div>
  );
}

import Link from "next/link";
import {
  BadgeCheck,
  Banknote,
  CalendarCheck,
  Star,
  Users,
  ArrowRight,
} from "lucide-react";
import HeroSearch from "@/components/home/HeroSearch";
import Reveal from "@/components/Reveal";

const FLOATING_STATS = [
  { icon: Users, label: "Verified tutors", value: "320+" },
  { icon: CalendarCheck, label: "Active batches", value: "540+" },
  { icon: Star, label: "Avg. rating", value: "4.9" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="hero-glow absolute inset-0" aria-hidden="true" />
      <div className="grid-pattern absolute inset-0" aria-hidden="true" />

      <div className="container-x relative grid items-center gap-14 py-16 lg:grid-cols-2 lg:py-24">
        {/* Copy */}
        <Reveal>
          <span className="section-eyebrow">
            <BadgeCheck className="h-3.5 w-3.5" /> Smart tuition &amp; mentorship
          </span>

          <h1 className="mt-6 text-[clamp(2.2rem,1.4rem+3.2vw,4rem)] font-extrabold leading-[1.06] tracking-tight text-base-content">
            Find Your Ideal Tutor or{" "}
            <span className="text-gradient">Mentorship Batch</span> Today
          </h1>

          <p className="section-subtitle mt-5">
            Search hundreds of admin-approved tuition batches by subject, class
            level, mode (Online/Offline) and monthly budget — then apply in
            seconds and track your application in real time.
          </p>

          <HeroSearch />

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/tuitions" className="btn-brand">
              Browse Tuitions <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/sign-up?role=tutor" className="btn-ghost-brand">
              Become a Tutor
            </Link>
          </div>

          <dl className="mt-12 grid max-w-lg grid-cols-3 gap-4">
            {FLOATING_STATS.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="rounded-2xl border border-base-content/10 bg-base-100/70 p-4 backdrop-blur"
              >
                <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                <dt className="mt-2 text-xl font-extrabold">{value}</dt>
                <dd className="text-xs font-semibold text-base-content/55">{label}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        {/* Visual mock-up */}
        <Reveal delay={140} className="relative">
          <div className="relative mx-auto max-w-md">
            <div className="absolute -left-6 -top-6 hidden rounded-2xl border border-base-content/10 bg-base-100 px-4 py-3 shadow-xl shadow-primary/10 sm:block">
              <div className="flex items-center gap-2 text-xs font-bold">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-success/15 text-success">
                  <BadgeCheck className="h-4 w-4" />
                </span>
                Admin approved listing
              </div>
            </div>

            <div className="rounded-3xl border border-base-content/10 bg-base-100 p-5 shadow-2xl shadow-primary/15">
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold">Recommended for you</span>
                <span className="badge badge-primary badge-sm">Live</span>
              </div>

              <ul className="mt-4 space-y-3">
                {[
                  {
                    subject: "Mathematics",
                    title: "HSC Math Crash Batch 2026",
                    fee: "৳4,500",
                    mode: "Online",
                    color: "from-primary/80 to-secondary/70",
                  },
                  {
                    subject: "Physics",
                    title: "Class 9-10 Physics (Home)",
                    fee: "৳3,800",
                    mode: "Offline",
                    color: "from-secondary/80 to-accent/70",
                  },
                  {
                    subject: "Programming",
                    title: "Python Mentorship — 1-on-1",
                    fee: "৳6,000",
                    mode: "Online",
                    color: "from-accent/80 to-primary/70",
                  },
                ].map((item) => (
                  <li
                    key={item.title}
                    className="flex items-center gap-3 rounded-2xl border border-base-content/10 bg-base-200/70 p-3"
                  >
                    <span
                      className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${item.color} text-sm font-extrabold text-white`}
                    >
                      {item.subject.charAt(0)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold">
                        {item.title}
                      </span>
                      <span className="text-xs font-semibold text-base-content/55">
                        {item.subject} · {item.mode}
                      </span>
                    </span>
                    <span className="text-sm font-extrabold text-primary">
                      {item.fee}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex items-center justify-between rounded-2xl bg-neutral px-4 py-3 text-neutral-content">
                <span className="flex items-center gap-2 text-xs font-bold">
                  <Banknote className="h-4 w-4 text-secondary" />
                  Pro Tutor — unlimited posts
                </span>
                <Link href="/pricing" className="text-xs font-extrabold text-accent">
                  Upgrade →
                </Link>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-4 hidden rounded-2xl border border-base-content/10 bg-base-100 px-4 py-3 shadow-xl shadow-secondary/10 sm:block">
              <div className="flex items-center gap-2 text-xs font-bold">
                <span className="flex -space-x-2">
                  {["A", "R", "S"].map((letter, index) => (
                    <span
                      key={letter}
                      className="grid h-6 w-6 place-items-center rounded-full border-2 border-base-100 bg-primary text-[10px] font-extrabold text-primary-content"
                      style={{ zIndex: 3 - index }}
                    >
                      {letter}
                    </span>
                  ))}
                </span>
                1,200+ students applied this week
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

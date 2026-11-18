import { Atom, Calculator, Code2, Quote, Star, TestTube2, Languages } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import Reveal from "@/components/Reveal";

const SUBJECTS = [
  { icon: Calculator, name: "Mathematics", tuitions: 128 },
  { icon: Atom, name: "Physics", tuitions: 96 },
  { icon: Code2, name: "Programming", tuitions: 74 },
  { icon: Languages, name: "IELTS", tuitions: 61 },
  { icon: TestTube2, name: "Chemistry", tuitions: 88 },
];

const STATS = [
  { value: "12,000+", label: "Students helped" },
  { value: "320+", label: "Verified tutors" },
  { value: "540+", label: "Active batches" },
  { value: "4.9/5", label: "Average rating" },
];

const TESTIMONIALS = [
  {
    name: "Nusrat Jahan",
    role: "Class 10 student",
    text: "I found an Offline HSC Math tutor two streets away within a day. The application tracker told me exactly when she accepted me.",
  },
  {
    name: "Tanvir Ahmed",
    role: "Tutor · Pro plan",
    text: "Posting batches used to be chaotic — WhatsApp, Facebook groups. Now students apply with their schedule and I just approve.",
  },
  {
    name: "Sadia Rahman",
    role: "Parent, Dhaka",
    text: "Every tutor listing is approved by an admin, so I finally stopped worrying about fake profiles when paying monthly fees.",
  },
];

export default function StatsTestimonials() {
  return (
    <section className="container-x py-16 md:py-24">
      <SectionHeader
        eyebrow="Popular subjects"
        title="Top subjects on MentorLagbe"
        description="Thousands of students search these categories every week — and verified tutors keep them stocked with fresh batches."
      />

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {SUBJECTS.map(({ icon: Icon, name, tuitions }, index) => (
          <Reveal key={name} delay={index * 80}>
            <div className="group flex h-full flex-col items-center rounded-3xl border border-base-content/10 bg-base-100 p-6 text-center transition-all hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-primary/15 to-secondary/15 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-content">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-extrabold">{name}</h3>
              <p className="mt-1 text-xs font-bold text-base-content/55">
                {tuitions} live tuitions
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Platform statistics */}
      <dl className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STATS.map(({ value, label }, index) => (
          <Reveal key={label} delay={index * 80}>
            <div className="rounded-3xl bg-neutral p-6 text-center text-neutral-content">
              <dt className="text-3xl font-extrabold tracking-tight text-accent">
                {value}
              </dt>
              <dd className="mt-1 text-xs font-bold uppercase tracking-widest opacity-70">
                {label}
              </dd>
            </div>
          </Reveal>
        ))}
      </dl>

      {/* Testimonials */}
      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {TESTIMONIALS.map(({ name, role, text }, index) => (
          <Reveal key={name} delay={index * 110}>
            <figure className="card-brand h-full p-6">
              <Quote className="h-7 w-7 text-primary/40" aria-hidden="true" />
              <div className="mt-3 flex gap-0.5 text-warning">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Star
                    key={starIndex}
                    className="h-4 w-4 fill-current"
                    aria-hidden="true"
                  />
                ))}
              </div>
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-base-content/70">
                “{text}”
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-dashed border-base-content/15 pt-4">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/15 text-sm font-extrabold text-primary">
                  {name.charAt(0)}
                </span>
                <span>
                  <span className="block text-sm font-extrabold">{name}</span>
                  <span className="text-xs font-semibold text-base-content/55">
                    {role}
                  </span>
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

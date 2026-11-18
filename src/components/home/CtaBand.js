import Link from "next/link";
import { ArrowRight, GraduationCap } from "lucide-react";
import Reveal from "@/components/Reveal";

export default function CtaBand() {
  return (
    <section className="container-x pb-20 pt-4">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-secondary px-8 py-14 text-center text-primary-content shadow-2xl shadow-primary/30">
          <span
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, white 1px, transparent 1px)",
              backgroundSize: "26px 26px",
            }}
            aria-hidden="true"
          />
          <div className="relative">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/15">
              <GraduationCap className="h-7 w-7" aria-hidden="true" />
            </span>
            <h2 className="mx-auto mt-5 max-w-2xl text-[clamp(1.6rem,1.1rem+2vw,2.5rem)] font-extrabold leading-tight tracking-tight">
              Ready to find your ideal tutor — or fill your next batch?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm font-medium leading-relaxed text-primary-content/85 sm:text-base">
              Join thousands of students and tutors using MentorLagbe to manage
              tuition the smart way.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/tuitions"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-extrabold text-primary transition-transform hover:-translate-y-0.5"
              >
                Browse Tuitions <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 rounded-xl border border-white/40 px-6 py-3 text-sm font-extrabold text-white transition-colors hover:bg-white/10"
              >
                Create free account
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

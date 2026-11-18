import Link from "next/link";
import { ArrowRight, Search, ClipboardCheck, Send, UserRoundCheck } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import Reveal from "@/components/Reveal";

const STEPS = [
  {
    icon: UserRoundCheck,
    title: "Create your account",
    text: "Sign up as a Student or Tutor in under a minute — your plan starts as Free.",
  },
  {
    icon: Search,
    title: "Search & filter",
    text: "Students browse approved batches by subject, class level, mode and budget.",
  },
  {
    icon: ClipboardCheck,
    title: "Admin approval",
    text: "Every tuition post is reviewed by an admin before it goes public.",
  },
  {
    icon: Send,
    title: "Apply & manage",
    text: "Students apply with their schedule; tutors accept or reject in real time.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="container-x scroll-mt-24 py-16 md:py-24">
      <SectionHeader
        eyebrow="How MentorLagbe works"
        title="Four simple steps from search to session"
        description="A transparent, moderated workflow that keeps students safe and tutors in control of their batches."
        action={
          <Link href="/sign-up" className="btn-brand">
            Get started free <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />

      <ol className="relative mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <span
          className="absolute left-0 right-0 top-9 hidden border-t-2 border-dashed border-base-content/15 lg:block"
          aria-hidden="true"
        />

        {STEPS.map(({ icon: Icon, title, text }, index) => (
          <Reveal key={title} delay={index * 100} className="relative">
            <li className="h-full rounded-3xl border border-base-content/10 bg-base-100 p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10">
              <div className="flex items-center gap-3">
                <span className="relative grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                  <span className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-primary text-[11px] font-extrabold text-primary-content">
                    {index + 1}
                  </span>
                </span>
                <h3 className="text-base font-extrabold leading-tight">{title}</h3>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-base-content/65">{text}</p>
            </li>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

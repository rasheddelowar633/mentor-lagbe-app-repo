import { CreditCard, ShieldCheck, Sparkles, Zap } from "lucide-react";
import PlanCard from "@/components/PlanCard";
import SectionHeader from "@/components/SectionHeader";
import Reveal from "@/components/Reveal";
import { PLANS } from "@/lib/constants";

export const metadata = {
  title: "Pricing & Pro Plans",
  description:
    "Free vs Pro plans for tutors and students on MentorLagbe. Pro Tutor is $15/month, Pro Student is $10/month — billed securely via Stripe.",
};

const FREE_TUTOR = [
  "Create up to 2 tuition posts",
  "Receive & manage student applicants",
  "Standard dashboard analytics",
  "Community support",
];

const FREE_STUDENT = [
  "Browse every approved tuition",
  "Apply to unlimited batches",
  "Track application status live",
  "Save favourite tuitions",
];

const FAQS = [
  {
    q: "How is the subscription billed?",
    a: "Both Pro plans are monthly Stripe subscriptions of $15 (Tutor) and $10 (Student). You can cancel any time from your Stripe account.",
  },
  {
    q: "Do I need a Pro plan to use MentorLagbe?",
    a: "No. Students can browse and apply for free forever, and tutors can always publish up to two tuition posts on the Free plan.",
  },
  {
    q: "When does my plan upgrade take effect?",
    a: "Immediately after the Stripe checkout succeeds — your plan switches to 'pro' and every transaction is recorded in your dashboard.",
  },
];

export default function PricingPage() {
  return (
    <div className="py-14 md:py-20">
      <div className="container-x">
        <SectionHeader
          eyebrow={<><Zap className="h-3.5 w-3.5" /> Pricing</>}
          title="Simple plans that grow with you"
          description="Start free, upgrade only when you need unlimited posts or priority booking. Every payment is handled securely by Stripe."
        />

        {/* ---------- Tutors ---------- */}
        <div className="mt-16">
          <div className="mb-6 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-xl font-extrabold">For Tutors</h2>
              <p className="text-sm font-medium text-base-content/60">
                Post batches, collect applications, grow your classes.
              </p>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:max-w-4xl">
            <Reveal>
              <PlanCard
                free
                name="Free Tutor"
                price={0}
                role="tutor"
                description="Everything you need to post your first batches."
                features={FREE_TUTOR}
              />
            </Reveal>
            <Reveal delay={110}>
              <PlanCard
                name={PLANS.tutor.name}
                price={PLANS.tutor.price}
                role="tutor"
                planId={PLANS.tutor.id}
                highlighted
                description="Unlimited posts, verified badge and priority placement."
                features={PLANS.tutor.features}
              />
            </Reveal>
          </div>
        </div>

        {/* ---------- Students ---------- */}
        <div className="mt-16">
          <div className="mb-6 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-secondary/10 text-secondary">
              <CreditCard className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-xl font-extrabold">For Students</h2>
              <p className="text-sm font-medium text-base-content/60">
                Find, apply and book faster than everyone else.
              </p>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:max-w-4xl">
            <Reveal>
              <PlanCard
                free
                name="Free Student"
                price={0}
                role="student"
                description="Search and apply to any approved tuition."
                features={FREE_STUDENT}
              />
            </Reveal>
            <Reveal delay={110}>
              <PlanCard
                name={PLANS.student.name}
                price={PLANS.student.price}
                role="student"
                planId={PLANS.student.id}
                description="Priority booking, direct messages and a verified badge."
                features={PLANS.student.features}
              />
            </Reveal>
          </div>
        </div>

        {/* ---------- FAQ ---------- */}
        <div className="mx-auto mt-16 max-w-3xl">
          <h2 className="text-center text-2xl font-extrabold tracking-tight">
            Frequently asked questions
          </h2>
          <div className="mt-6 flex flex-col gap-3">
            {FAQS.map(({ q, a }) => (
              <div
                key={q}
                className="rounded-2xl border border-base-content/10 bg-base-100 p-5"
              >
                <h3 className="font-extrabold">{q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-base-content/65">{a}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 flex items-center justify-center gap-2 text-center text-sm font-semibold text-base-content/60">
            <ShieldCheck className="h-4 w-4 text-success" />
            Secured by Stripe · No card details are stored on MentorLagbe.
          </p>
        </div>
      </div>
    </div>
  );
}

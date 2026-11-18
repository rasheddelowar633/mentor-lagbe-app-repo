import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import PlanCard from "@/components/PlanCard";
import Reveal from "@/components/Reveal";
import { PLANS } from "@/lib/constants";

export default function PricingPreview() {
  return (
    <section className="relative overflow-hidden bg-base-200 py-16 md:py-24">
      <div className="grid-pattern absolute inset-0 opacity-60" aria-hidden="true" />

      <div className="container-x relative">
        <SectionHeader
          eyebrow="Pro plans"
          title="Upgrade when you are ready"
          description="Start free, then unlock unlimited tuition posts (tutors) or priority booking (students) with a secure Stripe subscription."
          action={
            <Link href="/pricing" className="btn-ghost-brand">
              Compare all plans <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />

        <div className="mx-auto mt-14 grid max-w-4xl gap-8 md:grid-cols-2">
          <Reveal>
            <PlanCard
              name={PLANS.tutor.name}
              price={PLANS.tutor.price}
              role="tutor"
              planId={PLANS.tutor.id}
              highlighted
              description="For tutors who want to grow without limits."
              features={PLANS.tutor.features.slice(0, 4)}
            />
          </Reveal>

          <Reveal delay={120}>
            <PlanCard
              name={PLANS.student.name}
              price={PLANS.student.price}
              role="student"
              planId={PLANS.student.id}
              description="For students who want first access to batches."
              features={PLANS.student.features.slice(0, 4)}
            />
          </Reveal>
        </div>

        <p className="mt-10 flex items-center justify-center gap-2 text-sm font-semibold text-base-content/60">
          <ShieldCheck className="h-4 w-4 text-success" />
          Payments are processed by Stripe — MentorLagbe never stores your card details.
        </p>
      </div>
    </section>
  );
}

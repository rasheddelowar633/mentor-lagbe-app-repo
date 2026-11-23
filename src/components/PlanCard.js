import Link from "next/link";
import { Check, Crown } from "lucide-react";
import SubscribeButton from "@/components/SubscribeButton";


export default function PlanCard({
  name,
  price,
  period = "/ month",
  role,
  description,
  features = [],
  planId,
  highlighted = false,
  free = false,
}) {
  return (
    <div
      className={`relative flex h-full flex-col rounded-3xl border p-7 transition-all ${
        highlighted
          ? "border-primary bg-base-100 shadow-2xl shadow-primary/20"
          : "border-base-content/10 bg-base-100"
      }`}
    >
      {highlighted && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-[11px] font-extrabold uppercase tracking-widest text-primary-content">
          Most popular
        </span>
      )}

      <div className="flex items-center gap-2">
        <span
          className={`grid h-10 w-10 place-items-center rounded-xl ${
            highlighted ? "bg-primary text-primary-content" : "bg-base-200 text-base-content/70"
          }`}
        >
          <Crown className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h3 className="text-lg font-extrabold">{name}</h3>
          <p className="text-xs font-semibold uppercase tracking-widest text-base-content/50">
            For {role}s
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-baseline gap-1">
        <span className="text-5xl font-extrabold tracking-tight">
          ${price}
        </span>
        {!free && (
          <span className="text-sm font-bold text-base-content/55">{period}</span>
        )}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-base-content/65">
        {description}
      </p>

      <ul className="mt-6 flex flex-col gap-3 text-sm">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5">
            <span
              className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${
                highlighted ? "bg-primary/15 text-primary" : "bg-success/15 text-success"
              }`}
            >
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
            </span>
            <span className="font-medium text-base-content/75">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-7">
        {free ? (
          <Link href="/sign-up" className="btn-ghost-brand w-full">
            Get Started Free
          </Link>
        ) : (
          <SubscribeButton planId={planId} planRole={role} />
        )}
      </div>
    </div>
  );
}

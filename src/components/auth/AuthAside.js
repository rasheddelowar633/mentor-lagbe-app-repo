"use client";

import { GraduationCap, ShieldCheck, Users } from "lucide-react";
import Logo from "@/components/Logo";

/** Shared brand panel for the sign-up / sign-in pages. */
export default function AuthAside({ title, points }) {
  return (
    <aside className="relative hidden overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-secondary p-10 text-primary-content lg:flex lg:flex-col lg:justify-between">
      <span
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 15%, white 1.5px, transparent 1.5px)",
          backgroundSize: "30px 30px",
        }}
        aria-hidden="true"
      />

      <div className="relative">
        <Logo href="/" className="[&_span:nth-child(2)]:text-white" />
      </div>

      <div className="relative">
        <h2 className="text-3xl font-extrabold leading-tight tracking-tight">
          {title}
        </h2>
        <ul className="mt-7 flex flex-col gap-4">
          {points.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-start gap-3 text-sm font-medium text-primary-content/90">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/20">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              {text}
            </li>
          ))}
        </ul>
      </div>

      <p className="relative text-xs font-semibold text-primary-content/70">
        Trusted by 12,000+ students and 320+ verified tutors across Bangladesh.
      </p>
    </aside>
  );
}

export const AUTH_POINTS = {
  signUp: [
    { icon: Users, text: "Choose your role — Student or Tutor — at registration." },
    { icon: ShieldCheck, text: "Tuition posts are reviewed by an admin before going live." },
    { icon: GraduationCap, text: "Free plan forever; upgrade to Pro with Stripe any time." },
  ],
  signIn: [
    { icon: ShieldCheck, text: "Password authentication secured by BetterAuth." },
    { icon: GraduationCap, text: "Your dashboard remembers you — no re-login on reload." },
    { icon: Users, text: "One account works across web and every device." },
  ],
};

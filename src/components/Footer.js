import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import Logo from "@/components/Logo";
import CurrentYear from "@/components/CurrentYear";
import { CONTACT, NAV_LINKS } from "@/lib/constants";

/** The new X (formerly Twitter) wordmark – not the old bird. */
function XLogo({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookLogo({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.5-1.5h1.7V3.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H7.3V13h2.6v8h3.6z" />
    </svg>
  );
}

function LinkedInLogo({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M6.94 8.5H3.56V21h3.38V8.5zM5.25 3a1.97 1.97 0 1 0 .01 3.94A1.97 1.97 0 0 0 5.25 3zM21 14.42v6.58h-3.38v-6.1c0-1.53-.55-2.57-1.92-2.57-1.05 0-1.67.71-1.94 1.4-.1.24-.13.58-.13.92v6.35H10.3s.05-10.3 0-11.35h3.38v1.61c.45-.7 1.25-1.7 3.05-1.7 2.23 0 4.27 1.46 4.27 4.58z" />
    </svg>
  );
}

function InstagramLogo({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23a3.7 3.7 0 0 1-.9 1.38c-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2zm0 3.3a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zm0 10.72a4.22 4.22 0 1 1 0-8.44 4.22 4.22 0 0 1 0 8.44zm8.28-10.98a1.52 1.52 0 1 1-3.04 0 1.52 1.52 0 0 1 3.04 0z" />
    </svg>
  );
}

function YouTubeLogo({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M23 12s0-3.2-.4-4.7a2.5 2.5 0 0 0-1.8-1.8C19.2 5 12 5 12 5s-7.2 0-8.8.5A2.5 2.5 0 0 0 1.4 7.3C1 8.8 1 12 1 12s0 3.2.4 4.7a2.5 2.5 0 0 0 1.8 1.8c1.6.5 8.8.5 8.8.5s7.2 0 8.8-.5a2.5 2.5 0 0 0 1.8-1.8C23 15.2 23 12 23 12zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
    </svg>
  );
}

const SOCIALS = [
  { label: "X", href: "https://x.com", icon: XLogo },
  { label: "Facebook", href: "https://facebook.com", icon: FacebookLogo },
  { label: "LinkedIn", href: "https://linkedin.com", icon: LinkedInLogo },
  { label: "Instagram", href: "https://instagram.com", icon: InstagramLogo },
  { label: "YouTube", href: "https://youtube.com", icon: YouTubeLogo },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-base-content/10 bg-base-200">
      <div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div className="max-w-sm">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-base-content/65">
            MentorLagbe is a smart tuition &amp; mentorship platform that connects
            verified tutors with students — search by subject, class level, mode
            and monthly budget.
          </p>
          <div className="mt-5 flex gap-2">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="grid h-9 w-9 place-items-center rounded-lg border border-base-content/10 bg-base-100 text-base-content/70 transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary"
              >
                <social.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-widest text-base-content/80">
            Quick Links
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="font-medium text-base-content/65 transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/sign-up"
                className="font-medium text-base-content/65 transition-colors hover:text-primary"
              >
                Become a Tutor
              </Link>
            </li>
          </ul>
        </div>

        {/* For students */}
        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-widest text-base-content/80">
            For Students
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link
                href="/tuitions?mode=Online"
                className="font-medium text-base-content/65 transition-colors hover:text-primary"
              >
                Online Tuitions
              </Link>
            </li>
            <li>
              <Link
                href="/tuitions?mode=Offline"
                className="font-medium text-base-content/65 transition-colors hover:text-primary"
              >
                Home Tuitions
              </Link>
            </li>
            <li>
              <Link
                href="/pricing"
                className="font-medium text-base-content/65 transition-colors hover:text-primary"
              >
                Pro Plans
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/student/my-applications"
                className="font-medium text-base-content/65 transition-colors hover:text-primary"
              >
                Track Applications
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-widest text-base-content/80">
            Contact
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-base-content/65">
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <a
                href={`mailto:${CONTACT.email}`}
                className="font-medium transition-colors hover:text-primary"
              >
                {CONTACT.email}
              </a>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <a
                href={`tel:${CONTACT.phone.replace(/[^+\d]/g, "")}`}
                className="font-medium transition-colors hover:text-primary"
              >
                {CONTACT.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span className="font-medium">{CONTACT.address}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-base-content/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs font-medium text-base-content/55 sm:flex-row">
          <p>
            © <CurrentYear /> MentorLagbe. All rights reserved.
          </p>
          <p>
            Built with Next.js, Express, MongoDB, BetterAuth &amp; Stripe.
          </p>
        </div>
      </div>
    </footer>
  );
}

import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { AuthProvider } from "@/providers/AuthProvider";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const themeScript = `try{var t=localStorage.getItem("mentorlagbe-theme");document.documentElement.setAttribute("data-theme",t||"mentor")}catch(e){document.documentElement.setAttribute("data-theme","mentor")}`;

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: {
    default: "MentorLagbe — Find Your Ideal Tutor or Mentorship Batch",
    template: "%s | MentorLagbe",
  },
  description:
    "MentorLagbe is a smart tuition & mentorship platform connecting verified tutors with students. Search approved tuition batches by subject, class level, mode and monthly budget.",
  keywords: [
    "tuition",
    "tutor",
    "mentorship",
    "online tuition Bangladesh",
    "private tutor",
    "MentorLagbe",
  ],
  openGraph: {
    title: "MentorLagbe — Smart Tuition & Mentorship Platform",
    description:
      "Find verified tutors, browse approved tuition batches and book 1-on-1 mentorship sessions.",
    type: "website",
    siteName: "MentorLagbe",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${jakarta.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col bg-base-100 text-base-content antialiased">
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster position="top-right" richColors closeButton />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

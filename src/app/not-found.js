import Link from "next/link";
import { Compass, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container-x flex min-h-[65vh] flex-col items-center justify-center py-24 text-center">
      <span className="text-[7rem] font-extrabold leading-none text-gradient">404</span>
      <span className="mt-4 grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
        <Compass className="h-7 w-7" aria-hidden="true" />
      </span>
      <h1 className="mt-5 text-2xl font-extrabold tracking-tight">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-base-content/65">
        The page you are looking for does not exist or may have been moved.
        Let&apos;s get you back on track.
      </p>
      <Link href="/" className="btn-brand mt-8">
        <Home className="h-4 w-4" /> Back to Home
      </Link>
    </div>
  );
}

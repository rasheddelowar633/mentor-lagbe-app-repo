"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LayoutDashboard, LogOut, Menu, UserRound, X } from "lucide-react";
import Logo from "@/components/Logo";
import RoleBadge from "@/components/RoleBadge";
import ThemeToggle from "@/components/ThemeToggle";
import { NAV_LINKS } from "@/lib/constants";
import { useAuth } from "@/providers/AuthProvider";

function NavLink({ href, active }) {
  return (
    <Link
      href={href}
      className={`rounded-lg px-3 py-2 text-sm font-bold transition-colors ${
        active
          ? "bg-primary/10 text-primary"
          : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
      }`}
    >
      {NAV_LINKS.find((link) => link.href === href)?.label ?? href}
    </Link>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, loading, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  /* Close the drawer on Escape (keyboard accessibility). */
  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  /* Close the drawer when the route changes — adjusted during render. */
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMobileOpen(false);
  }

  const handleSignOut = async () => {
    await signOut();
    setMobileOpen(false);
    toast.success("You have been signed out.");
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-base-content/10 bg-base-100/85 backdrop-blur-xl">
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Logo />

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              active={link.href === "/" ? pathname === "/" : pathname.startsWith(link.href.split("#")[0])}
            />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {loading ? (
            <span className="skeleton h-9 w-28 rounded-lg" aria-hidden="true" />
          ) : user ? (
            <div className="dropdown dropdown-end">
              <button
                type="button"
                tabIndex={0}
                className="flex cursor-pointer items-center gap-2 rounded-full border border-base-content/10 py-1 pl-1 pr-3 hover:bg-base-200"
              >
                <span className="grid h-8 w-8 place-items-center overflow-hidden rounded-full bg-primary/15 text-sm font-extrabold text-primary">
                  {user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.image}
                      alt={user.name || "User"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    (user.name || "U").charAt(0).toUpperCase()
                  )}
                </span>
                <span className="hidden flex-col items-start leading-tight sm:flex">
                  <span className="max-w-[8rem] truncate text-sm font-bold">
                    {user.name}
                  </span>
                  <RoleBadge role={role} />
                </span>
              </button>

              <ul
                tabIndex={0}
                className="menu dropdown-content z-50 mt-3 w-56 rounded-box border border-base-content/10 bg-base-100 p-2 shadow-xl"
              >
                <li className="menu-title px-3 py-1">
                  <span className="truncate font-bold text-base-content">{user.name}</span>
                  <span className="truncate text-xs font-normal text-base-content/60">
                    {user.email}
                  </span>
                </li>
                <li>
                  <Link href="/dashboard" className="gap-2 font-semibold">
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/profile" className="gap-2 font-semibold">
                    <UserRound className="h-4 w-4" /> Update Profile
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="gap-2 font-semibold text-error"
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link href="/sign-in" className="btn-ghost-brand !px-4 !py-2 text-sm">
                Sign In
              </Link>
              <Link href="/sign-up" className="btn-brand !px-4 !py-2 text-sm">
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile menu trigger */}
          <button
            type="button"
            className="btn btn-circle btn-ghost btn-sm border border-base-content/10 lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      {mobileOpen && (
        <div className="border-t border-base-content/10 bg-base-100 lg:hidden">
          <nav className="container-x flex flex-col gap-1 py-3" aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                active={
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href.split("#")[0])
                }
              />
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-base-content/10 pt-3">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="btn-brand w-full text-sm"
                  >
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="btn-ghost-brand w-full text-sm text-error"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    onClick={() => setMobileOpen(false)}
                    className="btn-ghost-brand w-full text-sm"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    onClick={() => setMobileOpen(false)}
                    className="btn-brand w-full text-sm"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

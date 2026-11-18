"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Banknote,
  Bookmark,
  BookOpen,
  CreditCard,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  UserRound,
  Users,
  X,
} from "lucide-react";
import Logo from "@/components/Logo";
import RoleBadge from "@/components/RoleBadge";
import ThemeToggle from "@/components/ThemeToggle";
import { DASHBOARD_NAV } from "@/lib/constants";
import { useAuth } from "@/providers/AuthProvider";

const ICONS = {
  layout: LayoutDashboard,
  file: FileText,
  bookmark: Bookmark,
  user: UserRound,
  plus: Plus,
  book: BookOpen,
  users: Users,
  card: CreditCard,
  banknote: Banknote,
};

function defaultPath(role) {
  if (role === "admin") return "/dashboard/admin";
  if (role === "tutor") return "/dashboard/tutor";
  return "/dashboard/student";
}

function SidebarNav({ role, pathname, collapsed, onNavigate }) {
  const items = DASHBOARD_NAV[role] || [];

  return (
    <nav className="flex flex-col gap-1 px-3" aria-label="Dashboard">
      {items.map(({ label, href, icon }) => {
        const Icon = ICONS[icon] || LayoutDashboard;
        const active =
          href === "/dashboard/profile"
            ? pathname === href
            : pathname === href || pathname.startsWith(`${href}/`);

        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            title={collapsed ? label : undefined}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-colors ${
              active
                ? "bg-primary text-primary-content shadow-md shadow-primary/25"
                : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
            } ${collapsed ? "justify-center px-0" : ""}`}
          >
            <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
            {!collapsed && <span className="truncate">{label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, role, plan, loading, signOut } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const requiredRole = useMemo(() => {
    if (pathname.startsWith("/dashboard/admin")) return "admin";
    if (pathname.startsWith("/dashboard/tutor")) return "tutor";
    if (pathname.startsWith("/dashboard/student")) return "student";
    return null;
  }, [pathname]);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/sign-in");
      return;
    }
    if (requiredRole && role && requiredRole !== role) {
      toast.error("You do not have permission to open that dashboard.");
      router.replace(defaultPath(role));
    }
  }, [loading, user, role, requiredRole, router]);

  /* Close the mobile drawer on navigation — adjusted during render. */
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMobileOpen(false);
  }

  /* Session still resolving — never bounce a logged-in user to /sign-in. */
  if (loading || !user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-base-200/60">
        <span className="inline-block h-9 w-9 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm font-bold text-base-content/60">
          Checking your session…
        </p>
      </div>
    );
  }

  const activeRole = role || "student";
  const pageTitle =
    (DASHBOARD_NAV[activeRole] || []).find(
      (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
    )?.label || "Dashboard";

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between gap-2 px-4 py-4">
        <Logo compact={collapsed} />
        <button
          type="button"
          className="btn btn-circle btn-ghost btn-sm lg:hidden"
          aria-label="Close sidebar"
          onClick={() => setMobileOpen(false)}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="px-3 pb-2">
        <div
          className={`rounded-2xl border border-base-content/10 bg-base-200/70 p-3 ${
            collapsed ? "mx-1 !p-2 text-center" : ""
          }`}
        >
          {collapsed ? (
            <span className="mx-auto grid h-8 w-8 place-items-center rounded-full bg-primary/15 text-xs font-extrabold text-primary">
              {(user.name || "U").charAt(0).toUpperCase()}
            </span>
          ) : (
            <>
              <p className="truncate text-sm font-extrabold">{user.name}</p>
              <div className="mt-1.5 flex items-center gap-2">
                <RoleBadge role={activeRole} />
                <span
                  className={`badge badge-sm font-bold ${
                    plan === "pro" ? "badge-accent" : "badge-ghost"
                  }`}
                >
                  {plan === "pro" ? "PRO" : "FREE"}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-2 flex-1 overflow-y-auto dashboard-scroll">
        <SidebarNav
          role={activeRole}
          pathname={pathname}
          collapsed={collapsed}
          onNavigate={() => setMobileOpen(false)}
        />
      </div>

      <div className="border-t border-base-content/10 p-3">
        {plan !== "pro" && !collapsed && (
          <Link
            href="/pricing"
            className="mb-2 block rounded-xl bg-gradient-to-r from-primary to-secondary px-4 py-3 text-center text-xs font-extrabold text-primary-content transition-transform hover:-translate-y-0.5"
          >
            ⚡ Upgrade to Pro
          </Link>
        )}
        <button
          type="button"
          onClick={async () => {
            await signOut();
            toast.success("You have been signed out.");
            router.push("/");
          }}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-error transition-colors hover:bg-error/10 ${
            collapsed ? "justify-center px-0" : ""
          }`}
        >
          <LogOut className="h-5 w-5 shrink-0" aria-hidden="true" />
          {!collapsed && "Sign Out"}
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-base-200/50">
      {/* Desktop sidebar */}
      <aside
        className={`sticky top-0 hidden h-screen shrink-0 flex-col border-r border-base-content/10 bg-base-100 transition-all duration-200 lg:flex ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close sidebar overlay"
            className="absolute inset-0 bg-black/45"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col bg-base-100 shadow-2xl">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-base-content/10 bg-base-100/90 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              aria-label="Toggle sidebar"
              onClick={() => setCollapsed((value) => !value)}
              className="btn btn-circle btn-ghost btn-sm hidden border border-base-content/10 lg:inline-flex"
            >
              {collapsed ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </button>
            <button
              type="button"
              aria-label="Open sidebar"
              onClick={() => setMobileOpen(true)}
              className="btn btn-circle btn-ghost btn-sm border border-base-content/10 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold sm:text-base">
                {pageTitle}
              </p>
              <p className="hidden text-xs font-semibold text-base-content/50 sm:block">
                MentorLagbe dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="btn btn-ghost btn-sm hidden rounded-lg font-bold sm:inline-flex"
            >
              View site
            </Link>
            <ThemeToggle />

            <div className="dropdown dropdown-end">
              <button
                type="button"
                tabIndex={0}
                className="flex cursor-pointer items-center gap-2 rounded-full border border-base-content/10 py-1 pl-1 pr-2 hover:bg-base-200"
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
                <span className="hidden max-w-[8rem] truncate text-sm font-bold sm:block">
                  {user.name}
                </span>
              </button>
              <ul
                tabIndex={0}
                className="menu dropdown-content z-50 mt-3 w-52 rounded-box border border-base-content/10 bg-base-100 p-2 shadow-xl"
              >
                <li className="menu-title px-3 py-1">
                  <span className="truncate font-bold text-base-content">
                    {profile?.email || user.email}
                  </span>
                </li>
                <li>
                  <Link href="/dashboard/profile" className="gap-2 font-semibold">
                    <UserRound className="h-4 w-4" /> Update Profile
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="gap-2 font-semibold">
                    <CreditCard className="h-4 w-4" /> Upgrade plan
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={async () => {
                      await signOut();
                      toast.success("You have been signed out.");
                      router.push("/");
                    }}
                    className="gap-2 font-semibold text-error"
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </header>

        <main id="main-content" className="flex-1 p-4 sm:p-6 lg:p-8" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}

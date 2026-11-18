"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";

function defaultPath(role) {
  if (role === "admin") return "/dashboard/admin";
  if (role === "tutor") return "/dashboard/tutor";
  return "/dashboard/student";
}

/** /dashboard sends each role to its own overview page. */
export default function DashboardIndexPage() {
  const router = useRouter();
  const { role, loading } = useAuth();

  useEffect(() => {
    if (!loading) router.replace(defaultPath(role));
  }, [loading, role, router]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <span className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

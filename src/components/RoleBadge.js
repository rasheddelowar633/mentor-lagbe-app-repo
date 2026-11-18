import { ROLE_LABELS } from "@/lib/constants";

const STYLES = {
  student: "badge-info badge-outline",
  tutor: "badge-secondary badge-outline",
  admin: "badge-primary",
};

export default function RoleBadge({ role, className = "" }) {
  if (!role) return null;
  return (
    <span className={`badge badge-sm font-bold ${STYLES[role] || "badge-ghost"} ${className}`}>
      {ROLE_LABELS[role] || role}
    </span>
  );
}

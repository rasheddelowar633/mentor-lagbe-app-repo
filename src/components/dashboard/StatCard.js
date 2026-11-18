/** Reusable dashboard statistics card (same design for every role). */
export default function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tone = "primary",
}) {
  const tones = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    accent: "bg-accent/15 text-accent",
    success: "bg-success/15 text-success",
    warning: "bg-warning/15 text-warning",
    error: "bg-error/10 text-error",
    info: "bg-info/15 text-info",
  };

  return (
    <div className="stat-card flex items-start gap-4 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10">
      {Icon && (
        <span
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${
            tones[tone] || tones.primary
          }`}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      )}
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-widest text-base-content/50">
          {label}
        </p>
        <p className="mt-1 truncate text-2xl font-extrabold tracking-tight">
          {value}
        </p>
        {hint && (
          <p className="mt-1 truncate text-xs font-semibold text-base-content/55">
            {hint}
          </p>
        )}
      </div>
    </div>
  );
}

import Reveal from "@/components/Reveal";

/**
 * One consistent heading style is used for every section of the site
 * (README UI requirement).
 */
export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  action = null,
  className = "",
}) {
  const centered = align === "center";

  return (
    <Reveal
      className={`flex flex-col gap-4 ${
        centered ? "items-center text-center" : "items-start text-left"
      } ${className}`}
    >
      {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
      <h2 className="section-title max-w-3xl">{title}</h2>
      {description && <p className="section-subtitle">{description}</p>}
      {action && <div className="mt-1">{action}</div>}
    </Reveal>
  );
}

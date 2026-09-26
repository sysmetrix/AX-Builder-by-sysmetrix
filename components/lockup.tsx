import { BrandMark, type MarkMotion, type MarkVariant } from "./brand-mark";

export type LockupLayout = "horizontal" | "stacked" | "compact";

/**
 * Mark + wordmark. "AX Builder" is the name, "by sysmetrix" is secondary.
 * compact = mark only (header on scroll, small UI, favicon family).
 */
export function Lockup({
  layout = "horizontal",
  variant = "connector",
  motion,
  size = 40,
}: {
  layout?: LockupLayout;
  variant?: MarkVariant;
  motion?: MarkMotion;
  /** mark width in px; text scales from it */
  size?: number;
}) {
  const label = "AX Builder by sysmetrix";
  if (layout === "compact") {
    return (
      <span className="lockup lockup-compact" role="img" aria-label={label}>
        <BrandMark variant={variant} motion={motion} size={size} />
      </span>
    );
  }
  return (
    <span
      className={`lockup lockup-${layout} ${motion ? `lk-${motion}` : ""}`}
      role="img"
      aria-label={label}
      style={{ ["--lk" as string]: `${size}px` }}
    >
      <BrandMark variant={variant} motion={motion} size={size} />
      <span className="lk-text" aria-hidden="true">
        <span className="lk-name">AX Builder</span>
        <span className="lk-by">by sysmetrix</span>
      </span>
    </span>
  );
}

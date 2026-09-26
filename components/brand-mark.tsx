/**
 * AX mark — DECIDED at the Logo/Motion Gate: "connector" (M2) is the brand mark; the other variants are kept for the /brand lab only. All share one construction:
 * the right foot of the "A" and the lower-left tip of the "X" are the same point (31,37).
 * Path order is a contract used by the motion CSS:
 *   1 = A legs, 2 = accent bar, 3 = X stroke "\", 4 = X stroke "/", 5+ = optional extras.
 * The static state is complete; motion classes only add a one-shot entrance.
 */
export type MarkVariant = "shared" | "connector" | "axis" | "frame";
export type MarkMotion = "draw" | "assemble" | "connect";

const A = "M3 37 L17 3 L31 37";
const X1 = "M31 3 L57 37";
const X2 = "M31 37 L57 3";

const variants: Record<MarkVariant, { bar: string; extras: string[] }> = {
  // v1: A crossbar sits inside the A.
  shared: { bar: "M7.6 26 H26.4", extras: [] },
  // v2: crossbar extends across to the X's crossing point — A and X are joined by the bar.
  connector: { bar: "M10 20 H44", extras: [] },
  // v3: shared baseline "axis" runs under both letters.
  axis: { bar: "M7.6 26 H26.4", extras: ["M-4 37 H64"] },
  // v4: viewfinder / builder-frame corner ticks.
  frame: {
    bar: "M7.6 26 H26.4",
    extras: ["M-4 9 V-2 H7", "M64 9 V-2 H53", "M-4 31 V42 H7", "M64 31 V42 H53"],
  },
};

/** Thin strokes disappear at favicon sizes, so weight steps up as the mark gets smaller. */
function strokeFor(size?: number) {
  if (!size) return undefined;
  if (size <= 24) return 4.8;
  if (size <= 40) return 3.8;
  return undefined;
}

export function BrandMark({
  variant = "connector",
  motion,
  draw = false,
  size,
  className = "",
}: {
  variant?: MarkVariant;
  motion?: MarkMotion;
  /** legacy shorthand for motion="draw" */
  draw?: boolean;
  /** explicit pixel width; height follows the 3:2 viewBox */
  size?: number;
  className?: string;
}) {
  const v = variants[variant];
  const m = motion ?? (draw ? "draw" : undefined);
  const sw = strokeFor(size);
  return (
    <svg
      className={`mark ${m ? `m-${m}` : ""} ${className}`}
      viewBox={variant === "frame" ? "-6 -4 70 48" : "0 0 60 40"}
      width={size}
      height={size ? (size * (variant === "frame" ? 48 : 40)) / (variant === "frame" ? 70 : 60) : undefined}
      style={sw ? { strokeWidth: sw } : undefined}
      aria-hidden="true"
      focusable="false"
    >
      <path pathLength={1} d={A} />
      <path pathLength={1} className="mark-bar" d={v.bar} />
      <path pathLength={1} d={X1} />
      <path pathLength={1} d={X2} />
      {v.extras.map((d) => (
        <path key={d} pathLength={1} className="mark-extra" d={d} />
      ))}
    </svg>
  );
}

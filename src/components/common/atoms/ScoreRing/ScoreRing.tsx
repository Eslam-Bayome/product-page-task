import { useFormatter, useTranslations } from "use-intl";

import { cn } from "@lib/utils";

import { type ScoreRingProps } from "./ScoreRing.types";

// Drawn in a 100-unit box; stroke widths match the design at 64px (4.48)
// and 84px (4.2).
const RADIUS = 46;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Average-rating donut (Figma 57:1640 / 62:1276): grey track, orange arc
 * starting at 3 o'clock and running clockwise.
 */
function ScoreRing({ score, max = 5, className, ...props }: ScoreRingProps) {
  const t = useTranslations("reviews");
  const format = useFormatter();
  const ratio = Math.min(Math.max(score / max, 0), 1);
  const value = format.number(score, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  return (
    <div
      role="img"
      aria-label={t("averageRating", { rating: value, max })}
      className={cn("relative size-16 shrink-0 lg:size-21", className)}
      {...props}
    >
      <svg viewBox="0 0 100 100" className="size-full" aria-hidden>
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          className="stroke-border-soft stroke-7 lg:stroke-5"
        />
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          strokeDasharray={`${ratio * CIRCUMFERENCE} ${CIRCUMFERENCE}`}
          className="stroke-rating stroke-7 lg:stroke-5"
        />
      </svg>
      <span className="lg:tracking-normal absolute inset-0 flex items-center justify-center text-18 leading-normal font-semibold tracking-heading text-ink lg:text-20">
        {value}
      </span>
    </div>
  );
}

export { ScoreRing };

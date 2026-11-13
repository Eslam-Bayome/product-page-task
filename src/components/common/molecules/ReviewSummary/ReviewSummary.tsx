import { useFormatter, useTranslations } from "use-intl";

import { cn } from "@lib/utils";

import { type ReviewSummaryProps } from "./ReviewSummary.types";
import { RatingStars } from "../../atoms/RatingStars";
import { ScoreRing } from "../../atoms/ScoreRing";
import { RatingBar } from "../RatingBar";

/**
 * Average score, stars and the per-star breakdown in a dashed box
 * (Figma 57:1638 / 62:1273).
 */
function ReviewSummary({ summary, className, ...props }: ReviewSummaryProps) {
  const t = useTranslations("reviews");
  const format = useFormatter();

  return (
    <div
      className={cn(
        "flex flex-col gap-6 rounded-sm border-[0.8px] border-dashed border-border-button p-4 lg:flex-row lg:items-start lg:justify-between lg:rounded-lg lg:p-6",
        className,
      )}
      {...props}
    >
      <div className="flex w-49 items-center justify-between lg:w-auto lg:justify-start lg:gap-4">
        <ScoreRing score={summary.average} />
        <div className="flex flex-col gap-1 lg:gap-2">
          <RatingStars rating={summary.average} />
          <p className="text-12 leading-relaxed font-medium text-ink lg:text-16 lg:font-normal lg:text-option-foreground">
            {t("fromCount", {
              count: format.number(summary.total, { notation: "compact" }),
            })}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-3 pe-2 lg:w-201 lg:pe-0">
        {summary.breakdown.map((row) => (
          <RatingBar
            key={row.stars}
            stars={row.stars}
            count={row.count}
            total={summary.total}
          />
        ))}
      </div>
    </div>
  );
}

export { ReviewSummary };

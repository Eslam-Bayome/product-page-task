import { useFormatter, useTranslations } from "use-intl";

import starIcon from "@/assets/icons/star.svg";
import { Progress } from "@components/ui/progress";
import { cn } from "@lib/utils";

import { type RatingBarProps } from "./RatingBar.types";

/**
 * One row of the rating breakdown — "5.0 ★ ▬▬▬▬ 2823" (Figma 57:1653 /
 * 62:1289): 8px bar, square on mobile, rounded on desktop. Mobile rows are
 * 17px, so the 19px text overhangs them as in Figma.
 */
function RatingBar({
  stars,
  count,
  total,
  className,
  ...props
}: RatingBarProps) {
  const t = useTranslations("reviews");
  const format = useFormatter();
  const percent = total > 0 ? (count / total) * 100 : 0;

  return (
    <div
      className={cn(
        "grid h-4.25 grid-cols-[auto_1fr_--spacing(7.5)] items-center gap-x-3 text-12 leading-relaxed font-medium text-ink lg:h-auto lg:grid-cols-[auto_1fr_--spacing(9.75)] lg:gap-x-6 lg:text-16",
        className,
      )}
      {...props}
    >
      <span className="flex items-center lg:gap-1">
        <span className="w-6 lg:w-auto">
          {format.number(stars, { minimumFractionDigits: 1 })}
        </span>
        <img src={starIcon} alt="" className="size-4 lg:size-5" />
      </span>
      <Progress
        value={percent}
        aria-label={t("starReviews", { stars })}
        className="h-2 rounded-none bg-border-soft lg:rounded-lg rtl:-scale-x-100 [&>[data-slot=progress-indicator]]:bg-heading lg:[&>[data-slot=progress-indicator]]:rounded-lg"
      />
      <span className="text-end tabular-nums lg:text-start">
        {format.number(count)}
      </span>
    </div>
  );
}

export { RatingBar };

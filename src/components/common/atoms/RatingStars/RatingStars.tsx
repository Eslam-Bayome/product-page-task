import { useTranslations } from "use-intl";

import starIcon from "@/assets/icons/star.svg";
import { cn } from "@lib/utils";

import { type RatingStarsProps } from "./RatingStars.types";
import { ratingStarVariants } from "./RatingStars.variants";

/**
 * Row of the design's star icon, 4px apart (Figma 57:1645). Fractional
 * ratings clip the last star over a faded one.
 */
function RatingStars({
  rating,
  max = 5,
  size,
  className,
  ...props
}: RatingStarsProps) {
  const t = useTranslations("common");
  const clamped = Math.min(Math.max(rating, 0), max);
  const starClass = ratingStarVariants({ size });

  return (
    <div
      role="img"
      aria-label={t("ratedOutOf", { rating: clamped, max })}
      className={cn("flex items-center gap-1", className)}
      {...props}
    >
      {Array.from({ length: max }, (_, index) => {
        const fill = Math.min(Math.max(clamped - index, 0), 1);
        return (
          <span key={index} className="relative inline-flex">
            <img
              src={starIcon}
              alt=""
              className={cn(starClass, "opacity-20")}
            />
            <span
              className="absolute inset-y-0 start-0 overflow-hidden"
              style={{ width: `${fill * 100}%` }}
            >
              <img
                src={starIcon}
                alt=""
                className={cn(starClass, "max-w-none")}
              />
            </span>
          </span>
        );
      })}
    </div>
  );
}

export { RatingStars };

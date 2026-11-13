import { useTranslations } from "use-intl";

import arrowIcon from "@/assets/icons/arrow-down-sm.svg";
import starIcon from "@/assets/icons/star.svg";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@components/ui/collapsible";
import { REVIEW_TOPICS } from "@lib/reviews";
import { cn } from "@lib/utils";

import { type ReviewFiltersProps } from "./ReviewFilters.types";
import { DashedDivider } from "../../atoms/DashedDivider";
import { FilterCheckbox } from "../../atoms/FilterCheckbox";

const toggle = <T,>(list: T[], value: T) =>
  list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];

const optionLabel =
  "flex cursor-pointer items-center gap-2 text-16 leading-relaxed font-semibold text-meta-foreground";

/** Rating and topic checklists in collapsible groups (Figma 57:1531). */
function ReviewFilters({
  ratings,
  topics,
  onRatingsChange,
  onTopicsChange,
  className,
  ...props
}: ReviewFiltersProps) {
  const t = useTranslations("reviews");

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-lg border-[0.8px] border-dashed border-border-filter p-6",
        className,
      )}
      {...props}
    >
      <h3 className="text-20 leading-normal font-semibold tracking-heading text-heading">
        {t("filterTitle")}
      </h3>
      <DashedDivider />
      <div className="mt-2 flex flex-col gap-6">
        <FilterGroup title={t("rating")}>
          {[5, 4, 3, 2, 1].map((stars) => (
            <label key={stars} className={optionLabel}>
              <FilterCheckbox
                checked={ratings.includes(stars)}
                onCheckedChange={() => onRatingsChange(toggle(ratings, stars))}
              />
              <span className="flex items-center gap-1">
                <img src={starIcon} alt="" className="size-4.5" />
                <span aria-hidden>{stars}</span>
                <span className="sr-only">{t("stars", { stars })}</span>
              </span>
            </label>
          ))}
        </FilterGroup>
        <DashedDivider />
        <FilterGroup title={t("topicsTitle")}>
          {REVIEW_TOPICS.map((topic) => (
            <label key={topic} className={optionLabel}>
              <FilterCheckbox
                checked={topics.includes(topic)}
                onCheckedChange={() => onTopicsChange(toggle(topics, topic))}
              />
              {t(`topics.${topic}`)}
            </label>
          ))}
        </FilterGroup>
      </div>
    </div>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Collapsible defaultOpen className="group/filter flex flex-col gap-3">
      <CollapsibleTrigger className="flex items-center justify-between text-16 leading-normal font-semibold tracking-heading text-foreground">
        {title}
        <img
          src={arrowIcon}
          alt=""
          className="size-3 group-data-[state=open]/filter:-scale-y-100"
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="flex flex-col gap-3">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

export { ReviewFilters };

import { Fragment, useMemo, useState } from "react";
import { useTranslations } from "use-intl";

import filterIcon from "@/assets/icons/filter.svg";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@components/ui/sheet";
import {
  filterReviews,
  paginate,
  REVIEW_TABS,
  type ReviewTab,
  type ReviewTopic,
} from "@lib/reviews";
import { cn } from "@lib/utils";

import { type ProductReviewsProps } from "./ProductReviews.types";
import { DashedDivider } from "../../atoms/DashedDivider";
import { Typography } from "../../atoms/Typography";
import { ReviewItem } from "../../molecules/ReviewItem";
import { ReviewPagination } from "../../molecules/ReviewPagination";
import { ReviewSummary } from "../../molecules/ReviewSummary";
import { SheetCloseButton } from "../../molecules/SheetCloseButton";
import { ReviewFilters } from "../ReviewFilters";

const toggleIn = (set: Set<string>, id: string, on: boolean) => {
  const next = new Set(set);
  if (on) next.add(id);
  else next.delete(id);
  return next;
};

/**
 * Summary, filters, tabs, paginated list and votes (Figma 57:1529 / 79:692).
 * On mobile the filters move into a bottom sheet behind the filter button.
 */
function ProductReviews({
  reviews,
  summary,
  className,
  ...props
}: ProductReviewsProps) {
  const t = useTranslations("reviews");
  const [ratings, setRatings] = useState<number[]>([]);
  const [topics, setTopics] = useState<ReviewTopic[]>([]);
  const [tab, setTab] = useState<ReviewTab>("all");
  const [page, setPage] = useState(1);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [disliked, setDisliked] = useState<Set<string>>(new Set());

  const filtered = useMemo(
    () => filterReviews(reviews, { ratings, topics, tab }),
    [reviews, ratings, topics, tab],
  );
  const current = paginate(filtered, page);

  // Any filter change starts again from the first page.
  const renderFilters = (className?: string) => (
    <ReviewFilters
      className={className}
      ratings={ratings}
      topics={topics}
      onRatingsChange={(next) => {
        setRatings(next);
        setPage(1);
      }}
      onTopicsChange={(next) => {
        setTopics(next);
        setPage(1);
      }}
    />
  );

  return (
    <section
      aria-label={t("title")}
      className={cn("flex flex-col gap-9 lg:gap-8", className)}
      {...props}
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 lg:gap-6">
          <Typography
            variant="heading"
            className="max-lg:leading-normal max-lg:tracking-heading"
          >
            {t("title")}
          </Typography>
          <ReviewSummary summary={summary} />
        </div>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-lg:hidden lg:w-69.5 [&>div]:min-h-147">
            {renderFilters()}
          </div>

          <div className="flex flex-col gap-8 lg:w-220.5 lg:gap-8.5">
            <div className="flex flex-col gap-4">
              <h3 className="text-16 leading-normal font-semibold tracking-heading text-foreground lg:text-20 lg:text-heading">
                {t("listTitle")}
              </h3>
              <div className="flex items-start justify-between gap-2">
                <div
                  role="group"
                  aria-label={t("show")}
                  className="flex flex-wrap gap-2 lg:gap-3"
                >
                  {REVIEW_TABS.map((option) => {
                    const active = option === tab;
                    return (
                      <button
                        key={option}
                        type="button"
                        aria-pressed={active}
                        onClick={() => {
                          setTab(option);
                          setPage(1);
                        }}
                        className={cn(
                          "h-8 rounded-md border px-2.5 text-12 leading-relaxed font-medium lg:h-10.5 lg:rounded-lg lg:px-4 lg:text-14",
                          active
                            ? "border-border-strong bg-accent text-foreground lg:px-5"
                            : "border-border-soft text-ink hover:bg-muted lg:border-border lg:text-foreground",
                        )}
                      >
                        {t(`tabs.${option}`)}
                      </button>
                    );
                  })}
                </div>
                <Sheet>
                  <SheetTrigger
                    aria-label={t("filter")}
                    className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border-soft lg:hidden"
                  >
                    <img src={filterIcon} alt="" className="size-5" />
                  </SheetTrigger>
                  <SheetContent
                    side="bottom"
                    showCloseButton={false}
                    className="max-h-[85dvh] overflow-y-auto p-5"
                  >
                    <SheetCloseButton />
                    <SheetTitle className="sr-only">{t("filter")}</SheetTitle>
                    {renderFilters("rounded-none border-0 p-0")}
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {current.items.length === 0 ? (
              <Typography tone="muted">{t("empty")}</Typography>
            ) : (
              <div className="flex flex-col gap-6 lg:gap-8">
                {current.items.map((review, index) => (
                  <Fragment key={review.id}>
                    {index > 0 && <DashedDivider />}
                    <ReviewItem
                      review={review}
                      liked={liked.has(review.id)}
                      disliked={disliked.has(review.id)}
                      onLike={() => {
                        const on = !liked.has(review.id);
                        setLiked(toggleIn(liked, review.id, on));
                        if (on)
                          setDisliked(toggleIn(disliked, review.id, false));
                      }}
                      onDislike={() => {
                        const on = !disliked.has(review.id);
                        setDisliked(toggleIn(disliked, review.id, on));
                        if (on) setLiked(toggleIn(liked, review.id, false));
                      }}
                    />
                  </Fragment>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <ReviewPagination
        page={current.page}
        pageCount={current.pageCount}
        onPageChange={setPage}
        className="self-center ps-6 lg:ps-75"
      />
    </section>
  );
}

export { ProductReviews };

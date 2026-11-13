import { useLocale, useTranslations } from "use-intl";

import likeFilledGreenIcon from "@/assets/icons/like-filled-green.svg";
import likeFilledIcon from "@/assets/icons/like-filled.svg";
import likeIcon from "@/assets/icons/like.svg";
import { formatReviewDate } from "@lib/reviews";
import { cn } from "@lib/utils";

import { type ReviewItemProps } from "./ReviewItem.types";
import { RatingStars } from "../../atoms/RatingStars";

const voteButton =
  "flex h-8 items-center justify-center gap-1 rounded-md border border-border-soft p-2.5 text-12 leading-relaxed text-ink transition-colors hover:bg-muted lg:h-12.5 lg:gap-2 lg:rounded-lg lg:p-3 lg:text-16";

/**
 * One review (Figma 57:1699 / 62:1339): stars, title, date, author and the
 * like / dislike votes. The liked thumb is green on mobile, black on desktop.
 */
function ReviewItem({
  review,
  liked,
  disliked,
  onLike,
  onDislike,
  className,
  ...props
}: ReviewItemProps) {
  const t = useTranslations("reviews");
  const locale = useLocale();
  const likes = review.likes + (liked ? 1 : 0);

  return (
    <article
      className={cn(
        "flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between",
        className,
      )}
      {...props}
    >
      <div className="flex flex-col gap-3 lg:gap-4">
        <RatingStars rating={review.rating} />
        <div className="flex flex-col gap-0.5 lg:gap-1">
          <h4 className="text-14 leading-normal font-semibold tracking-heading text-foreground lg:text-18">
            {review.title}
          </h4>
          <time
            dateTime={review.createdAt}
            className="text-12 leading-relaxed text-meta-foreground lg:text-16"
          >
            {formatReviewDate(review.createdAt, locale)}
          </time>
        </div>
        <p className="flex items-center gap-2 text-12 leading-relaxed font-medium text-ink max-lg:hidden lg:mt-2 lg:gap-3 lg:text-16">
          <Avatar src={review.avatarUrl} name={review.author} />
          {review.author}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 text-12 leading-relaxed font-medium text-ink lg:hidden">
          <Avatar src={review.avatarUrl} name={review.author} />
          {review.author}
        </p>
        <div className="flex gap-2 lg:gap-4">
          <button
            type="button"
            aria-pressed={liked}
            aria-label={t("helpful", { count: likes })}
            onClick={onLike}
            className={cn(voteButton, "lg:w-20")}
          >
            {liked ? (
              <>
                <img
                  src={likeFilledGreenIcon}
                  alt=""
                  className="size-5 lg:hidden"
                />
                <img
                  src={likeFilledIcon}
                  alt=""
                  className="size-6 max-lg:hidden"
                />
              </>
            ) : (
              <img src={likeIcon} alt="" className="size-5 lg:size-6" />
            )}
            {likes}
          </button>
          <button
            type="button"
            aria-pressed={disliked}
            aria-label={t("notHelpful")}
            onClick={onDislike}
            className={cn(voteButton, "w-8 lg:w-12.5", disliked && "bg-accent")}
          >
            <img
              src={likeIcon}
              alt=""
              className="size-5 -scale-y-100 lg:size-6"
            />
          </button>
        </div>
      </div>
    </article>
  );
}

function Avatar({ src, name }: { src?: string; name: string }) {
  return src ? (
    <img src={src} alt="" className="size-6 rounded-full lg:size-8" />
  ) : (
    <span
      aria-hidden
      className="flex size-6 items-center justify-center rounded-full bg-muted text-12 uppercase lg:size-8"
    >
      {name.charAt(0)}
    </span>
  );
}

export { ReviewItem };

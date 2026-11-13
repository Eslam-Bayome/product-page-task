import { type ProductReview, type ReviewTab, type ReviewTopic } from "./review";

export type ReviewFilter = {
  /** Star levels to keep; empty keeps all. */
  ratings: number[];
  /** Topics to keep (any match); empty keeps all. */
  topics: ReviewTopic[];
  tab: ReviewTab;
};

export type ReviewSummary = {
  /** Mean rating, one decimal; 0 without reviews. */
  average: number;
  total: number;
  /** One row per star level, 5 down to 1. */
  breakdown: { stars: number; count: number }[];
};

export const REVIEWS_PER_PAGE = 4;

export const summarizeReviews = (reviews: ProductReview[]): ReviewSummary => {
  const total = reviews.length;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return {
    average: total > 0 ? Math.round((sum / total) * 10) / 10 : 0,
    total,
    breakdown: [5, 4, 3, 2, 1].map((stars) => ({
      stars,
      count: reviews.filter((review) => review.rating === stars).length,
    })),
  };
};

const matchesTab = (review: ProductReview, tab: ReviewTab) => {
  if (tab === "media") return review.hasMedia;
  if (tab === "description") return Boolean(review.description?.trim());
  return true;
};

export const filterReviews = (
  reviews: ProductReview[],
  { ratings, topics, tab }: ReviewFilter,
) =>
  reviews.filter(
    (review) =>
      matchesTab(review, tab) &&
      (ratings.length === 0 || ratings.includes(review.rating)) &&
      (topics.length === 0 ||
        review.topics.some((topic) => topics.includes(topic))),
  );

/** One page of `items`; `page` (1-based) is clamped into range. */
export const paginate = <T>(
  items: T[],
  page: number,
  size = REVIEWS_PER_PAGE,
) => {
  const pageCount = Math.max(1, Math.ceil(items.length / size));
  const current = Math.min(Math.max(page, 1), pageCount);
  return {
    items: items.slice((current - 1) * size, current * size),
    page: current,
    pageCount,
  };
};

/**
 * Page buttons to show: first, last and the neighbours of the current page,
 * with "ellipsis" for each gap — e.g. page 1 of 19 → 1 2 … 19.
 */
export const getPageList = (page: number, pageCount: number) => {
  const pages = [1, page - 1, page, page + 1, pageCount]
    .filter((value) => value >= 1 && value <= pageCount)
    .filter((value, index, all) => all.indexOf(value) === index)
    .sort((a, b) => a - b);

  return pages.flatMap((value, index) => {
    const previous = pages[index - 1];
    return previous !== undefined && value - previous > 1
      ? (["ellipsis", value] as const)
      : ([value] as const);
  });
};

const dateFormats = new Map<
  string,
  [Intl.DateTimeFormat, Intl.DateTimeFormat]
>();

/**
 * "July 2, 2020 03:29 PM", as in the design, in the given Intl locale.
 * Dates are authored in UTC and shown as written.
 */
export const formatReviewDate = (iso: string, locale: string) => {
  let formats = dateFormats.get(locale);
  if (!formats) {
    formats = [
      new Intl.DateTimeFormat(locale, {
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      }),
      new Intl.DateTimeFormat(locale, {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
      }),
    ];
    dateFormats.set(locale, formats);
  }
  const date = new Date(iso);
  return `${formats[0].format(date)} ${formats[1].format(date)}`;
};

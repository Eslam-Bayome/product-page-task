import { type Review } from "@integration/types";

// Labels live in messages (`reviews.topics.*`, `reviews.tabs.*`).
export const REVIEW_TOPICS = [
  "product-quality",
  "seller-services",
  "product-price",
  "shipment",
  "match-description",
] as const;

export type ReviewTopic = (typeof REVIEW_TOPICS)[number];

export const isReviewTopic = (value: string): value is ReviewTopic =>
  (REVIEW_TOPICS as readonly string[]).includes(value);

export const REVIEW_TABS = ["all", "media", "description"] as const;

export type ReviewTab = (typeof REVIEW_TABS)[number];

/** What the reviews UI renders — the API's sparse `Review` is mapped onto it. */
export type ProductReview = {
  id: string;
  /** Whole stars, 1–5. */
  rating: number;
  title: string;
  description?: string;
  author: string;
  avatarUrl?: string;
  /** ISO 8601. */
  createdAt: string;
  likes: number;
  topics: ReviewTopic[];
  hasMedia: boolean;
};

export const toProductReview = (review: Review): ProductReview => ({
  id: review.id,
  rating: Math.round(review.rating),
  title: review.comment ?? "",
  author: review.name ?? "Anonymous",
  createdAt: review.created_at,
  likes: 0,
  topics: [],
  hasMedia: false,
});

import { type ProductReview, type ReviewSummary } from "@lib/reviews";

export interface ProductReviewsProps extends React.ComponentProps<"section"> {
  reviews: ProductReview[];
  summary: ReviewSummary;
}

import { type ProductReview } from "@lib/reviews";

export interface ReviewItemProps extends React.ComponentProps<"article"> {
  review: ProductReview;
  liked: boolean;
  disliked: boolean;
  onLike: () => void;
  onDislike: () => void;
}

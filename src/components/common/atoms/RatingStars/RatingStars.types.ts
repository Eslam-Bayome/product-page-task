import { type VariantProps } from "class-variance-authority";

import { ratingStarVariants } from "./RatingStars.variants";

export interface RatingStarsProps
  extends React.ComponentProps<"div">, VariantProps<typeof ratingStarVariants> {
  /** 0–max, fractional values render partially filled stars. */
  rating: number;
  max?: number;
}

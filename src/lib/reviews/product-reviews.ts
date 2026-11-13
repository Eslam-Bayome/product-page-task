import { getMockData } from "@/mock";
import { type Product } from "@integration/types";
import { type Locale } from "@store/preferences";

import { type ProductReview, toProductReview } from "./review";

/** The product's reviews from the API, or the design's sample set while it sends none. */
export const getProductReviews = (
  product: Product,
  locale: Locale,
): ProductReview[] =>
  product.reviews?.length
    ? product.reviews.map(toProductReview)
    : getMockData(locale).reviews;

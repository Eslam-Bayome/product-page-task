import { type CatalogProduct } from "@lib/catalog";
// The file, not the barrel: lib/reviews imports this module (no cycle).
import { isReviewTopic, type ProductReview } from "@lib/reviews/review";
import { type Locale } from "@store/preferences";

import ar from "./ar.json";
import { MOCK_ASSETS } from "./assets";
import en from "./en.json";

type MockJson = typeof en;

export type MockData = {
  products: CatalogProduct[];
  reviews: ProductReview[];
};

const fromJson = (json: MockJson): MockData => ({
  products: json.products.map(({ image, ...product }) => ({
    ...product,
    imageUrl: MOCK_ASSETS[image] ?? "",
  })),
  reviews: json.reviews.map(({ avatar, topics, ...review }) => ({
    ...review,
    avatarUrl: MOCK_ASSETS[avatar],
    topics: topics.filter(isReviewTopic),
  })),
});

const DATA: Record<Locale, MockData> = {
  en: fromJson(en),
  ar: fromJson(ar),
};

/**
 * The design's sample products and reviews in the given language — the API
 * exposes a single product and no reviews (`src/mock/{en,ar}.json`).
 */
export const getMockData = (locale: Locale) => DATA[locale];

import { type Product } from "@integration/types";

import { type Selections } from "./variants";

/**
 * Gallery images: product images, the thumbnail, then each `image` variation's
 * photo (e.g. one per color), de-duplicated and in that order.
 */
export const getGalleryImages = (product: Product) => {
  const variationImages = product.variations
    .filter((variation) => variation.type === "image")
    .flatMap((variation) => variation.props.map((prop) => prop.value));

  return [
    ...new Set(
      [...product.images, product.thumb, ...variationImages].filter(
        (src): src is string => Boolean(src),
      ),
    ),
  ];
};

/** Image attached to the selected value of an `image` variation (e.g. color). */
export const getSelectionImage = (product: Product, selections: Selections) => {
  for (const variation of product.variations) {
    if (variation.type !== "image") continue;
    const selected = selections[variation.name];
    const prop = variation.props.find((p) => p.name === selected);
    if (prop?.value) return prop.value;
  }
  return undefined;
};

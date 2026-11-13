import { type Product } from "@integration/types";
import { type AddToCartInput } from "@store/cart";

import { getGalleryImages, getSelectionImage } from "./images";
import { getEffectivePrice } from "./pricing";
import { getMaxQuantity } from "./stock";
import { findVariant, getMissingVariations, type Selections } from "./variants";

/**
 * The cart line for the current selection, or `null` while a variation is
 * still unpicked. Keeps every product → cart mapping rule in one place.
 */
export const toCartInput = (
  product: Product,
  selections: Selections,
): AddToCartInput | null => {
  if (getMissingVariations(product, selections).length > 0) return null;

  const variant = findVariant(product, selections);
  // Every variation is picked but no variant matches: not purchasable.
  if (product.variants.length > 0 && !variant) return null;

  const { price, compareAtPrice } = getEffectivePrice(product);
  return {
    productId: product.id,
    variantId: variant?.id ?? null,
    name: product.name,
    image:
      getSelectionImage(product, selections) ??
      getGalleryImages(product)[0] ??
      "",
    options: selections,
    unitPrice: price,
    compareAtPrice,
    maxQuantity: getMaxQuantity(product, variant),
  };
};

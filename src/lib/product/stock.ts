import { type Product, type ProductVariant } from "@integration/types";

import { LOW_STOCK_THRESHOLD, MAX_QTY_PER_LINE } from "./constants";
import { matchesSelections, type Selections } from "./variants";

export const isInStock = (product: Product, variant?: ProductVariant) => {
  if (!product.track_stock) return true;
  return (variant?.quantity ?? product.quantity) > 0;
};

export type StockStatus =
  | { status: "in_stock" }
  | { status: "low_stock"; left: number }
  | { status: "out_of_stock" };

/** What the stock line under the price says. Untracked stock is always in. */
export const getStockStatus = (
  product: Product,
  variant?: ProductVariant,
): StockStatus => {
  if (!product.track_stock) return { status: "in_stock" };
  const left = variant?.quantity ?? product.quantity;
  if (left <= 0) return { status: "out_of_stock" };
  if (left <= LOW_STOCK_THRESHOLD) return { status: "low_stock", left };
  return { status: "in_stock" };
};

/** Upper bound for the quantity selector and the cart line. */
export const getMaxQuantity = (product: Product, variant?: ProductVariant) => {
  if (!product.track_stock) return MAX_QTY_PER_LINE;
  return Math.min(variant?.quantity ?? product.quantity, MAX_QTY_PER_LINE);
};

/**
 * Whether picking `prop` for `variation` (on top of the current selections)
 * can still lead to a purchasable variant. Selecting a value replaces the
 * current value of the same variation, so it is excluded from the match.
 */
export const isOptionAvailable = (
  product: Product,
  selections: Selections,
  variation: string,
  prop: string,
) => {
  if (product.variants.length === 0) return isInStock(product);

  const candidate: Selections = { ...selections, [variation]: prop };
  return product.variants.some(
    (variant) =>
      matchesSelections(variant, candidate) && isInStock(product, variant),
  );
};

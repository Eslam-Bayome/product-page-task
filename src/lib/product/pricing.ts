import { type Product } from "@integration/types";

export type EffectivePrice = {
  /** What the shopper pays. */
  price: number;
  /** Original price to strike through, when on sale. */
  compareAtPrice: number | null;
  onSale: boolean;
};

const toEffective = (price: number, salePrice: number): EffectivePrice =>
  salePrice > 0 && salePrice < price
    ? { price: salePrice, compareAtPrice: price, onSale: true }
    : { price, compareAtPrice: null, onSale: false };

/**
 * Always priced by the product's own `price` / `sale_price`: variant prices
 * are ignored so the price stays the same whatever the shopper picks.
 */
export const getEffectivePrice = (product: Product): EffectivePrice =>
  toEffective(product.price, product.sale_price);

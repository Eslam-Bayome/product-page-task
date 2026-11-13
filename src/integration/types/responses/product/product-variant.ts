import { type VariantProp } from "./variant-prop";

export type ProductVariant = {
  id: string;
  product_id: string;
  price: number;
  /** `0` means no sale price is set. */
  sale_price: number;
  quantity: number;
  taager_code: string;
  variation_props: VariantProp[];
};

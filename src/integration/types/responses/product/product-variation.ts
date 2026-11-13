import { type VariationProp } from "./variation-prop";

export type VariationType = "image" | "button" | (string & {});

export type ProductVariation = {
  id: string;
  /** Matches `VariantProp.variation`, e.g. "color", "size". */
  name: string;
  product_id: string;
  type: VariationType;
  props: VariationProp[];
};

export type VariantProp = {
  id: string;
  /** Variation name, e.g. "color". */
  variation: string;
  /** Selected prop name within that variation, e.g. "brown". */
  variation_prop: string;
  product_variant_id: string;
};

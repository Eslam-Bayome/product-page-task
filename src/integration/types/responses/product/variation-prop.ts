export type VariationProp = {
  id: string;
  name: string;
  variation_id: string;
  /** Swatch image URL for `image` variations; absent for `button` ones. */
  value?: string;
};

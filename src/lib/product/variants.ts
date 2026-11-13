import { type Product, type ProductVariant } from "@integration/types";

/** Variation name → selected prop name, e.g. `{ color: "brown", size: "40" }`. */
export type Selections = Record<string, string>;

const variantHas = (variant: ProductVariant, variation: string, prop: string) =>
  variant.variation_props.some(
    (vp) => vp.variation === variation && vp.variation_prop === prop,
  );

/** True when the variant agrees with every selection made so far (partial match). */
export const matchesSelections = (
  variant: ProductVariant,
  selections: Selections,
) =>
  Object.entries(selections).every(([variation, prop]) =>
    variantHas(variant, variation, prop),
  );

/** Names of variations the shopper still has to pick. */
export const getMissingVariations = (
  product: Product,
  selections: Selections,
) =>
  product.variations
    .map((variation) => variation.name)
    .filter((name) => !selections[name]);

/** The exact variant for a complete selection, otherwise `undefined`. */
export const findVariant = (
  product: Product,
  selections: Selections,
): ProductVariant | undefined => {
  if (getMissingVariations(product, selections).length > 0) return undefined;
  return product.variants.find((variant) =>
    matchesSelections(variant, selections),
  );
};

import { useCallback, useMemo, useState } from "react";

import { type Product } from "@integration/types";
import {
  findVariant,
  getEffectivePrice,
  getMaxQuantity,
  getMissingVariations,
  getSelectionImage,
  getStockStatus,
  isInStock,
  isOptionAvailable,
  toCartInput,
  type Selections,
} from "@lib/product";

/**
 * Variation selection state for one product plus everything derived from it:
 * the matched variant, price, stock, quantity bound, per-option availability
 * and the ready-to-add cart line (`null` until the selection is complete).
 */
export const useProductSelection = (
  product: Product,
  initialSelections: Selections = {},
) => {
  const [selections, setSelections] = useState<Selections>(initialSelections);

  const select = useCallback((variation: string, prop: string) => {
    setSelections((current) => ({ ...current, [variation]: prop }));
  }, []);

  const derived = useMemo(() => {
    const variant = findVariant(product, selections);
    const missingVariations = getMissingVariations(product, selections);

    const options = product.variations.map((variation) => ({
      name: variation.name,
      type:
        variation.type === "image" ? ("image" as const) : ("button" as const),
      options: variation.props.map((prop) => ({
        value: prop.name,
        label: prop.name,
        imageUrl: prop.value,
        disabled: !isOptionAvailable(
          product,
          selections,
          variation.name,
          prop.name,
        ),
      })),
    }));

    return {
      variant,
      missingVariations,
      isComplete: missingVariations.length === 0,
      // Price is product-level; stock falls back to it on a partial selection.
      price: getEffectivePrice(product),
      inStock: isInStock(product, variant),
      stock: getStockStatus(product, variant),
      maxQuantity: getMaxQuantity(product, variant),
      selectionImage: getSelectionImage(product, selections),
      cartInput: toCartInput(product, selections),
      options,
    };
  }, [product, selections]);

  return { selections, select, ...derived };
};

export type ProductSelection = ReturnType<typeof useProductSelection>;

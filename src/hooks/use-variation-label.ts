import { useCallback } from "react";
import { useTranslations } from "use-intl";

const KNOWN = ["color", "size"] as const;
type KnownVariation = (typeof KNOWN)[number];

const isKnown = (name: string): name is KnownVariation =>
  (KNOWN as readonly string[]).includes(name.toLowerCase());

/**
 * Display name for an API variation ("color" → "Color" / "اللون").
 * Variations the store invents fall back to their API name.
 */
export const useVariationLabel = () => {
  const t = useTranslations("product.variation");
  return useCallback(
    (name: string) =>
      isKnown(name) ? t(name.toLowerCase() as KnownVariation) : name,
    [t],
  );
};

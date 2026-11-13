import { useTranslations } from "use-intl";

import { useFormatPrice } from "@hooks/use-format-price";
import { cn } from "@lib/utils";

import { type PriceProps } from "./Price.types";
import { priceVariants } from "./Price.variants";

/** A USD amount shown in the shopper's currency and locale. */
function Price({ amount, variant, size, className, ...props }: PriceProps) {
  const t = useTranslations("common");
  const formatted = useFormatPrice()(amount);

  return (
    <span
      className={cn(priceVariants({ variant, size }), className)}
      {...props}
    >
      {variant === "compare" ? (
        // `<del>` keeps the struck-through original price meaningful to screen readers.
        <del>
          <span className="sr-only">{t("originalPrice")} </span>
          {formatted}
        </del>
      ) : (
        formatted
      )}
    </span>
  );
}

export { Price };

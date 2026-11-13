import { cn } from "@lib/utils";

import { type PriceBlockProps } from "./PriceBlock.types";
import { Price } from "../../atoms/Price";

function PriceBlock({
  price,
  compareAtPrice,
  size = "md",
  className,
  ...props
}: PriceBlockProps) {
  const onSale = compareAtPrice != null && compareAtPrice > price;

  return (
    <div className={cn("flex items-center gap-4", className)} {...props}>
      {onSale && (
        <Price amount={compareAtPrice} variant="compare" size={size} />
      )}
      <Price amount={price} size={size} />
    </div>
  );
}

export { PriceBlock };

import { Trash2Icon } from "lucide-react";
import { useTranslations } from "use-intl";

import { useVariationLabel } from "@hooks/use-variation-label";
import { cn } from "@lib/utils";

import { IconButton } from "../../atoms/IconButton";
import { Typography } from "../../atoms/Typography";
import { PriceBlock } from "../PriceBlock";
import { QuantitySelector } from "../QuantitySelector";
import { type CartLineItemProps } from "./CartLineItem.types";

function CartLineItem({
  name,
  imageUrl,
  options,
  unitPrice,
  compareAtPrice,
  quantity,
  maxQuantity,
  onQuantityChange,
  onRemove,
  className,
  ...props
}: CartLineItemProps) {
  const t = useTranslations();
  const variationLabel = useVariationLabel();
  const optionEntries = Object.entries(options ?? {});

  return (
    <li className={cn("flex gap-3 py-4", className)} {...props}>
      <img
        src={imageUrl}
        alt=""
        loading="lazy"
        className="size-20 shrink-0 rounded-md bg-surface-image object-cover"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <Typography as="h3" variant="label" className="line-clamp-2">
            {name}
          </Typography>
          <IconButton
            variant="ghost"
            size="icon-sm"
            icon={<Trash2Icon />}
            label={t("cart.remove", { name })}
            onClick={onRemove}
            className="-me-2 -mt-1 shrink-0 text-muted-foreground"
          />
        </div>
        {optionEntries.length > 0 && (
          <Typography variant="caption" tone="muted" className="capitalize">
            {optionEntries
              .map(([key, value]) => `${variationLabel(key)}: ${value}`)
              .join(" · ")}
          </Typography>
        )}
        <PriceBlock
          price={unitPrice}
          compareAtPrice={compareAtPrice}
          size="sm"
        />
        <QuantitySelector
          size="sm"
          value={quantity}
          max={maxQuantity}
          onChange={onQuantityChange}
          label={t("product.quantityLabel", { name })}
          className="mt-1 self-start"
        />
      </div>
    </li>
  );
}

export { CartLineItem };

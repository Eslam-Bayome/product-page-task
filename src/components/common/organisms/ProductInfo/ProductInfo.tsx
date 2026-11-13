import { useRef, useState } from "react";
import { toast } from "sonner";
import { useFormatter, useTranslations } from "use-intl";

import starIcon from "@/assets/icons/star.svg";
import { useVariationLabel } from "@hooks/use-variation-label";
import { analytics, type AnalyticsEvents } from "@integration/analytics";
import { cn } from "@lib/utils";
import { selectAddItem, selectSetOpen, useCartStore } from "@store/cart";

import { type ProductInfoProps } from "./ProductInfo.types";
import { Button } from "../../atoms/Button";
import { DashedDivider } from "../../atoms/DashedDivider";
import { Typography } from "../../atoms/Typography";
import { PriceBlock } from "../../molecules/PriceBlock";
import { ProductDescription } from "../../molecules/ProductDescription";
import { QuantitySelector } from "../../molecules/QuantitySelector";
import { VariationGroup } from "../../molecules/VariationGroup";

const groupLabel =
  "text-18 leading-tight font-medium text-subtle-foreground lg:text-20";
const textLink =
  "text-16 leading-tight font-medium underline decoration-from-font";

/**
 * Brand, title, price, description, variation pickers, quantity and the
 * cart CTAs (Figma 79:666 / 61:492). Validates the selection before adding.
 */
function ProductInfo({
  product,
  selection,
  rating,
  className,
  ...props
}: ProductInfoProps) {
  const t = useTranslations("product");
  const tCommon = useTranslations("common");
  const format = useFormatter();
  const variationLabel = useVariationLabel();
  const rootRef = useRef<HTMLDivElement>(null);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore(selectAddItem);
  const setCartOpen = useCartStore(selectSetOpen);

  const { price, options, selections, select, cartInput, inStock, stock } =
    selection;
  const maxQuantity = Math.max(selection.maxQuantity, 1);
  const lineQuantity = Math.min(quantity, maxQuantity);

  /** Adds the current selection; returns false (and explains why) when it can't. */
  const addToCart = (
    source: AnalyticsEvents["product_added_to_cart"]["source"],
  ) => {
    if (!cartInput) {
      const [missing] = selection.missingVariations;
      analytics.track("add_to_cart_blocked", {
        reason: missing ? "missing_variation" : "unavailable",
        variation: missing ?? null,
      });
      toast.error(
        missing
          ? t("missingVariation", { variation: variationLabel(missing) })
          : t("unavailable"),
      );
      rootRef.current
        ?.querySelector<HTMLButtonElement>(
          `[data-variation="${missing}"] button:not(:disabled)`,
        )
        ?.focus();
      return false;
    }

    const result = addItem(cartInput, lineQuantity);
    analytics.track("product_added_to_cart", {
      product_id: cartInput.productId,
      variant_id: cartInput.variantId,
      quantity: lineQuantity,
      price_usd: cartInput.unitPrice,
      source,
      clamped: result.clamped,
    });
    if (result.clamped) {
      toast.warning(
        t("limitReached", { max: maxQuantity, count: result.quantity }),
      );
    }
    return true;
  };

  return (
    <div
      ref={rootRef}
      className={cn("flex flex-col gap-12 lg:gap-14", className)}
      {...props}
    >
      <div className="flex flex-col gap-6 lg:gap-7">
        <div className="flex flex-col gap-7">
          <div className="flex flex-col gap-3.5 lg:gap-5">
            <div className="flex flex-col gap-2 lg:gap-3">
              {product.categories[0] && (
                <p className="text-13 leading-tight font-medium tracking-wide text-subtle-foreground lg:text-16">
                  {product.categories[0].name}
                </p>
              )}
              <Typography variant="display" tone="heading">
                {product.name}
              </Typography>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-4">
                <PriceBlock
                  price={price.price}
                  compareAtPrice={price.compareAtPrice}
                  size="lg"
                />
                {rating != null && rating > 0 && (
                  <p className="flex items-center gap-1 text-20 leading-none font-semibold text-foreground lg:text-24">
                    <img src={starIcon} alt="" className="size-5 lg:size-6" />
                    <span className="sr-only">{tCommon("rated")} </span>
                    {format.number(rating, {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    })}
                  </p>
                )}
              </div>
              {/* Not in Figma (the brief asks for it): follows the selected variant. */}
              <p
                role="status"
                className={cn(
                  "text-14 leading-relaxed font-medium",
                  stock.status === "in_stock" && "text-success",
                  stock.status === "low_stock" && "text-foreground",
                  stock.status === "out_of_stock" && "text-muted-foreground",
                )}
              >
                {stock.status === "in_stock" && t("inStock")}
                {stock.status === "low_stock" &&
                  t("lowStock", { left: stock.left })}
                {stock.status === "out_of_stock" && t("outOfStock")}
              </p>
            </div>
          </div>
          <DashedDivider />
        </div>

        <div className="flex flex-col gap-8 lg:gap-10">
          <ProductDescription html={product.description} />

          {options.map((variation) => (
            <div key={variation.name} data-variation={variation.name}>
              <VariationGroup
                name={variationLabel(variation.name)}
                type={variation.type}
                options={variation.options}
                value={selections[variation.name]}
                onValueChange={(value) => select(variation.name, value)}
                action={
                  variation.name === "size" ? (
                    <button
                      type="button"
                      className={cn(textLink, "text-option-foreground")}
                    >
                      {t("sizeChart")}
                    </button>
                  ) : undefined
                }
              />
            </div>
          ))}

          <div className="flex flex-col gap-4.5">
            <p className={groupLabel}>{t("quantity")}</p>
            <QuantitySelector
              value={lineQuantity}
              max={maxQuantity}
              disabled={!inStock}
              onChange={setQuantity}
              label={t("quantityLabel", { name: product.name })}
              className="self-start lg:rounded-lg"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start gap-4.5 lg:flex-row lg:gap-6">
        <Button
          size="xl"
          disabled={!inStock}
          onClick={() => {
            if (!addToCart("add_to_cart")) return;
            toast.success(t("added"), {
              action: {
                label: t("viewCart"),
                onClick: () => setCartOpen(true),
              },
            });
          }}
          className="w-74"
        >
          {inStock ? t("addToCart") : t("outOfStock")}
        </Button>
        <Button
          size="xl"
          variant="outline"
          disabled={!inStock}
          onClick={() => {
            if (addToCart("checkout_now")) setCartOpen(true);
          }}
          className="px-8.75 lg:w-50"
        >
          {t("checkoutNow")}
        </Button>
      </div>

      <button
        type="button"
        className={cn(
          textLink,
          // 56px column gap − 18px = the design's 38px above this link.
          "self-start text-faint-foreground max-lg:hidden lg:-mt-4.5",
        )}
      >
        {t("deliveryTerms")}
      </button>
    </div>
  );
}

export { ProductInfo };

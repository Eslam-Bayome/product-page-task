import { useFormatter, useTranslations } from "use-intl";

import starIcon from "@/assets/icons/star.svg";
import { cn } from "@lib/utils";

import { type ProductCardProps } from "./ProductCard.types";
import { Price } from "../../atoms/Price";

/**
 * Related / popular product tile (Figma 57:1448 / 62:1107). The whole card
 * is one link target.
 */
function ProductCard({
  imageUrl,
  brand,
  name,
  price,
  rating,
  soldCount,
  href,
  className,
  ...props
}: ProductCardProps) {
  const t = useTranslations();
  const format = useFormatter();

  return (
    <article
      className={cn("group relative flex flex-col gap-3 lg:gap-4", className)}
      {...props}
    >
      <div className="aspect-53/71 overflow-hidden rounded-md bg-surface-image lg:rounded-lg">
        <img
          src={imageUrl}
          alt={name}
          loading="lazy"
          decoding="async"
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col gap-1.5 lg:gap-2">
        <div className="flex flex-col gap-1 lg:gap-1.5">
          <h3 className="text-14 leading-normal font-semibold tracking-heading text-heading lg:text-18">
            {href ? (
              // Stretched link: the whole card is clickable with one tab stop.
              <a href={href} className="after:absolute after:inset-0">
                {brand}
              </a>
            ) : (
              brand
            )}
          </h3>
          <Price
            amount={price}
            className="text-16 leading-normal tracking-heading lg:text-20"
          />
          {/* One line so every card in a row keeps the same height. */}
          <p
            title={name}
            className="truncate text-13 leading-tight text-faint-foreground lg:text-16"
          >
            {name}
          </p>
        </div>
        {rating != null && (
          <div className="flex items-center gap-1.5 text-12 leading-relaxed lg:gap-2 lg:text-16">
            <img src={starIcon} alt="" className="size-3 lg:size-6" />
            <span className="text-ink">
              <span className="sr-only">{t("common.rated")} </span>
              {format.number(rating, {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              })}
            </span>
            {soldCount != null && (
              <>
                <span
                  aria-hidden
                  className="size-0.75 rounded-full bg-dot lg:size-1"
                />
                <span className="text-muted-foreground">
                  {t("grid.sold", { count: format.number(soldCount) })}
                </span>
              </>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export { ProductCard };

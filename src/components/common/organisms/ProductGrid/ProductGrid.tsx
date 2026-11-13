import { useTranslations } from "use-intl";

import { cn } from "@lib/utils";

import { type ProductGridProps } from "./ProductGrid.types";
import { ProductCard } from "../../molecules/ProductCard";
import { SectionHeader } from "../../molecules/SectionHeader";

/**
 * "Related Product" / "Popular this week" (Figma 57:1441 / 79:691): five
 * across on desktop, two-up on mobile.
 */
function ProductGrid({
  title,
  products,
  className,
  ...props
}: ProductGridProps) {
  const t = useTranslations("grid");

  return (
    <section
      aria-label={title}
      className={cn("flex flex-col gap-10 lg:gap-6", className)}
      {...props}
    >
      <SectionHeader
        title={title}
        action={
          <a
            href="#"
            className="text-16 leading-tight font-medium text-option-foreground underline decoration-from-font"
          >
            {t("viewAll")}
          </a>
        }
      />
      <div className="grid grid-cols-2 gap-x-5 gap-y-9 md:grid-cols-3 lg:grid-cols-5 lg:gap-x-8.75 lg:[&>:nth-child(n+6)]:hidden">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            imageUrl={product.imageUrl}
            brand={product.brand}
            name={product.name}
            price={product.price}
            rating={product.rating}
            soldCount={product.soldCount}
            href={product.href}
          />
        ))}
      </div>
    </section>
  );
}

export { ProductGrid };

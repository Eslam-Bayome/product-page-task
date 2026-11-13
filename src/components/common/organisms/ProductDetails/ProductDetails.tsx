import { useEffect, useMemo, useRef } from "react";

import { useProductSelection } from "@hooks/use-product-selection";
import { analytics } from "@integration/analytics";
import { getEffectivePrice, getGalleryImages } from "@lib/product";
import { cn } from "@lib/utils";

import { type ProductDetailsProps } from "./ProductDetails.types";
import { ProductGallery } from "../ProductGallery";
import { ProductInfo } from "../ProductInfo";

/**
 * The product hero: gallery beside the info column (Figma 79:667), stacked
 * on mobile. Owns the variation selection both sides read from.
 */
function ProductDetails({
  product,
  rating,
  className,
  ...props
}: ProductDetailsProps) {
  const selection = useProductSelection(product);
  const images = useMemo(() => getGalleryImages(product), [product]);

  // Analytics is an external system, so an effect is right here. The ref
  // keeps StrictMode's second run from counting the view twice.
  const viewedId = useRef<string | null>(null);
  useEffect(() => {
    if (viewedId.current === product.id) return;
    viewedId.current = product.id;
    const { price, onSale } = getEffectivePrice(product);
    analytics.track("product_viewed", {
      product_id: product.id,
      product_name: product.name,
      price_usd: price,
      on_sale: onSale,
    });
  }, [product]);

  return (
    <div
      className={cn(
        "flex flex-col gap-14 md:flex-row md:items-start md:gap-8 lg:justify-between lg:gap-0",
        className,
      )}
      {...props}
    >
      <ProductGallery
        productId={product.id}
        productName={product.name}
        images={images}
        activeImage={selection.selectionImage}
        className="md:min-w-0 md:flex-1 lg:w-136.25 lg:flex-none"
      />
      <ProductInfo
        product={product}
        selection={selection}
        rating={rating}
        className="md:min-w-0 md:flex-1 lg:w-130 lg:flex-none lg:pt-2.25"
      />
    </div>
  );
}

export { ProductDetails };

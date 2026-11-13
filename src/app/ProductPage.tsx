import { Suspense, useMemo, useState } from "react";
import { useTranslations } from "use-intl";

import { getMockData } from "@/mock";
// Folder imports, not the `@components/common` barrel: the barrel re-exports
// the lazy sections and would pull them back into the main chunk.
import { Button, DashedDivider, Typography } from "@components/common/atoms";
import { PageContainer } from "@components/common/layouts";
import { AnnouncementBar } from "@components/common/organisms/AnnouncementBar";
import { ProductBreadcrumb } from "@components/common/organisms/ProductBreadcrumb";
import {
  ProductDetails,
  ProductDetailsSkeleton,
} from "@components/common/organisms/ProductDetails";
import { SiteHeader } from "@components/common/organisms/SiteHeader";
import { useGetProduct } from "@integration/services/products";
import { type Product } from "@integration/types";
import { getProductReviews, summarizeReviews } from "@lib/reviews";
import { selectIsOpen, useCartStore } from "@store/cart";
import { selectLocale, usePreferencesStore } from "@store/preferences";

import {
  CartDrawer,
  ProductGrid,
  ProductReviews,
  SiteFooter,
} from "./lazy-sections";

const HOUR = 3600;

// The design's section rhythm: a dashed rule with 80px (desktop) / 56px
// (mobile) on either side.
const sectionRule = "my-14 lg:my-20";

/** Holds a lazy section's Figma height while its chunk loads. */
const Placeholder = ({ className }: { className: string }) => (
  <div aria-hidden className={className} />
);
const gridFallback = <Placeholder className="min-h-283 lg:min-h-124" />;

/** Everything below the header once the product has loaded. */
const ProductContent = ({ product }: { product: Product }) => {
  const t = useTranslations("grid");
  const locale = usePreferencesStore(selectLocale);
  const products = getMockData(locale).products;
  const reviews = useMemo(
    () => getProductReviews(product, locale),
    [product, locale],
  );
  const summary = useMemo(() => summarizeReviews(reviews), [reviews]);

  return (
    <>
      <ProductBreadcrumb
        productName={product.name}
        categories={product.categories}
      />
      <ProductDetails product={product} rating={summary.average} />
      <DashedDivider className={sectionRule} />
      <Suspense fallback={gridFallback}>
        <ProductGrid title={t("related")} products={products} />
      </Suspense>
      <DashedDivider className={sectionRule} />
      <Suspense fallback={<Placeholder className="min-h-292 lg:min-h-320" />}>
        <ProductReviews reviews={reviews} summary={summary} />
      </Suspense>
      <DashedDivider className={sectionRule} />
      <Suspense fallback={gridFallback}>
        <ProductGrid title={t("popular")} products={products} />
      </Suspense>
    </>
  );
};

/** The product detail page: chrome, then the product in its load states. */
const ProductPage = () => {
  const t = useTranslations();
  const { data: product, isPending, error, refetch } = useGetProduct();
  const isCartOpen = useCartStore(selectIsOpen);
  const [cartRequested, setCartRequested] = useState(isCartOpen);

  // Load the drawer's chunk the first time the cart opens, then keep it mounted.
  if (isCartOpen && !cartRequested) setCartRequested(true);

  const renderContent = () => {
    if (isPending) return <ProductDetailsSkeleton />;

    if (error) {
      return (
        <div className="flex flex-col items-start gap-4 py-16">
          <Typography variant="heading" tone="heading">
            {error.isNotFound
              ? t("errors.notFoundTitle")
              : t("errors.genericTitle")}
          </Typography>
          <Typography tone="muted">
            {error.isNotFound ? t("errors.notFoundBody") : error.message}
          </Typography>
          {!error.isNotFound && (
            <Button size="lg" onClick={() => void refetch()}>
              {t("common.tryAgain")}
            </Button>
          )}
        </div>
      );
    }

    return <ProductContent product={product} />;
  };

  return (
    <>
      <AnnouncementBar
        durationSeconds={(product?.fake_timer_hours ?? 1) * HOUR}
      />
      <SiteHeader />
      <main>
        <PageContainer>{renderContent()}</PageContainer>
      </main>
      <Suspense fallback={null}>
        <SiteFooter className="mt-14 lg:mt-20" />
      </Suspense>
      {cartRequested && (
        <Suspense fallback={null}>
          <CartDrawer />
        </Suspense>
      )}
    </>
  );
};

export { ProductPage };

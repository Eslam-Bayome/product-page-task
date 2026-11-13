import { lazy } from "react";

// Below-the-fold sections, split into their own chunks. Imported from the
// organism folders, not the `@components/common` barrel, so the barrel
// doesn't pull them back into the main bundle.

export const ProductGrid = lazy(() =>
  import("@components/common/organisms/ProductGrid").then((m) => ({
    default: m.ProductGrid,
  })),
);

export const ProductReviews = lazy(() =>
  import("@components/common/organisms/ProductReviews").then((m) => ({
    default: m.ProductReviews,
  })),
);

export const SiteFooter = lazy(() =>
  import("@components/common/organisms/SiteFooter").then((m) => ({
    default: m.SiteFooter,
  })),
);

export const CartDrawer = lazy(() =>
  import("@components/common/organisms/CartDrawer").then((m) => ({
    default: m.CartDrawer,
  })),
);

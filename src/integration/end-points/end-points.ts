export const endPoints = {
  products: {
    bySlug: "/products/slug/:store_slug/:product_slug",
  },
  rates: {
    latest: "/v6/latest/:base",
  },
} as const;

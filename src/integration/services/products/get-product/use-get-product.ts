import { useQuery } from "@tanstack/react-query";

import { PRODUCT_SLUG, STORE_SLUG } from "@config/env";

import { productQueryOptions } from "./get-product.query";

export const useGetProduct = (
  slug: string = PRODUCT_SLUG,
  storeSlug: string = STORE_SLUG,
) => useQuery(productQueryOptions({ storeSlug, slug }));

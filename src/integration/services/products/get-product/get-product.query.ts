import { queryOptions } from "@tanstack/react-query";

import { Keys } from "@integration/keys";

import { getProductAction, type GetProductInput } from "./get-product.action";

export const productQueryOptions = (input: GetProductInput) =>
  queryOptions({
    queryKey: [Keys.products.details, input.storeSlug, input.slug],
    queryFn: async ({ signal }) => {
      const { data, error } = await getProductAction(input, signal);
      if (error) throw error;
      return data;
    },
    // A missing product will not appear on retry.
    retry: (failureCount, error) => !error.isNotFound && failureCount < 1,
  });

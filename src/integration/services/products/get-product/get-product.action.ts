import { EasyOrdersBackend } from "@integration/api/backends";
import { tryCatch } from "@integration/api/try-catch";
import { endPoints } from "@integration/end-points";
import { type Product } from "@integration/types";

export type GetProductInput = {
  storeSlug: string;
  slug: string;
};

export const getProductAction = (
  { storeSlug, slug }: GetProductInput,
  signal?: AbortSignal,
) =>
  tryCatch(
    EasyOrdersBackend.get<Product>(
      endPoints.products.bySlug
        .replace(":store_slug", encodeURIComponent(storeSlug))
        .replace(":product_slug", encodeURIComponent(slug)),
      { params: { join: "reviews" }, signal },
    ),
  );

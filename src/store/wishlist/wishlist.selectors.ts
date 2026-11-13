import type { WishlistStore } from "./wishlist.types";

/** Selector factory; memoise at the call site with `useCallback`. */
export const makeSelectIsWishlisted =
  (productId: string) => (s: WishlistStore) =>
    s.productIds.includes(productId);

export const selectToggleWishlist = (s: WishlistStore) => s.toggle;

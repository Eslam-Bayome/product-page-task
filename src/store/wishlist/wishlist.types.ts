export type WishlistState = {
  productIds: string[];
};

export type WishlistActions = {
  /** Adds the product, or removes it when already saved. */
  toggle: (productId: string) => void;
  reset: () => void;
};

export type WishlistStore = WishlistState & WishlistActions;

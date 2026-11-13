import { createJSONStorage } from "zustand/middleware";

import type { WishlistState, WishlistStore } from "./wishlist.types";
import { createPersistedStore } from "../libs/create-store";

export const WISHLIST_STORAGE_KEY = "wishlist";

const initial: WishlistState = {
  productIds: [],
};

export const useWishlistStore = createPersistedStore<WishlistStore>(
  WISHLIST_STORAGE_KEY,
  (set) => ({
    ...initial,

    toggle: (productId) =>
      set((s) => {
        const index = s.productIds.indexOf(productId);
        if (index === -1) s.productIds.push(productId);
        else s.productIds.splice(index, 1);
      }),

    reset: () => set(() => initial),
  }),
  {
    storage: createJSONStorage(() => localStorage),
    partialize: (s) => ({ productIds: s.productIds }),
    version: 1,
  },
);

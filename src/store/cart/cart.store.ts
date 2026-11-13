import { createJSONStorage } from "zustand/middleware";

import type { CartState, CartStore } from "./cart.types";
import { createPersistedStore } from "../libs/create-store";

export const CART_STORAGE_KEY = "cart";

const initial: CartState = {
  items: [],
  isOpen: false,
};

export const toLineId = (productId: string, variantId: string | null) =>
  `${productId}:${variantId ?? "default"}`;

const clamp = (value: number, max: number) =>
  Math.min(Math.max(Math.trunc(value), 1), Math.max(max, 1));

export const useCartStore = createPersistedStore<CartStore>(
  CART_STORAGE_KEY,
  (set, get) => ({
    ...initial,

    addItem: (input, quantity = 1) => {
      const lineId = toLineId(input.productId, input.variantId);
      const existing = get().items.find((item) => item.lineId === lineId);
      const requested = (existing?.quantity ?? 0) + quantity;
      const next = clamp(requested, input.maxQuantity);

      set((s) => {
        const line = s.items.find((item) => item.lineId === lineId);
        if (line) {
          // Refresh price/stock snapshot so the cart reflects the latest data.
          Object.assign(line, input, { quantity: next });
        } else {
          s.items.push({ ...input, lineId, quantity: next });
        }
      });

      return { lineId, quantity: next, clamped: next < requested };
    },

    removeItem: (lineId) =>
      set((s) => {
        s.items = s.items.filter((item) => item.lineId !== lineId);
      }),

    updateQuantity: (lineId, quantity) =>
      set((s) => {
        const line = s.items.find((item) => item.lineId === lineId);
        if (line) line.quantity = clamp(quantity, line.maxQuantity);
      }),

    clear: () =>
      set((s) => {
        s.items = [];
      }),

    setOpen: (isOpen) =>
      set((s) => {
        s.isOpen = isOpen;
      }),

    reset: () => set(() => initial),
  }),
  {
    storage: createJSONStorage(() => localStorage),
    // Only the line items are durable; the drawer always starts closed.
    // Bump `version` and add `migrate` whenever the CartItem shape changes.
    partialize: (s) => ({ items: s.items }),
    version: 1,
  },
);

// Keep tabs in sync: another tab writing the cart rehydrates this one.
if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === CART_STORAGE_KEY) void useCartStore.persist.rehydrate();
  });
}

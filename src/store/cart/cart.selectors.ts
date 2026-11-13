import type { CartStore } from "./cart.types";

/**
 * Selectors are plain functions of state. Use at the call site:
 *   const count = useCartStore(selectItemCount)            // primitive → no wrapper
 *   const items = useCartStore(useShallow(selectItems))    // object/array → useShallow
 */

const roundMoney = (value: number) => Math.round(value * 100) / 100;

/* ─── State ─────────────────────────────────────────────── */
export const selectItems = (s: CartStore) => s.items;
export const selectIsOpen = (s: CartStore) => s.isOpen;
export const selectIsEmpty = (s: CartStore) => s.items.length === 0;

/** Total units across all lines — what the cart badge shows. */
export const selectItemCount = (s: CartStore) =>
  s.items.reduce((sum, item) => sum + item.quantity, 0);

export const selectSubtotal = (s: CartStore) =>
  roundMoney(
    s.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
  );

/** Amount saved versus original prices, for sale items. */
export const selectSavings = (s: CartStore) =>
  roundMoney(
    s.items.reduce(
      (sum, item) =>
        item.compareAtPrice && item.compareAtPrice > item.unitPrice
          ? sum + (item.compareAtPrice - item.unitPrice) * item.quantity
          : sum,
      0,
    ),
  );

/** Selector factory; memoise at the call site with `useMemo` / `useCallback`. */
export const makeSelectLine = (lineId: string) => (s: CartStore) =>
  s.items.find((item) => item.lineId === lineId);

/* ─── Actions (stable references) ───────────────────────── */
export const selectAddItem = (s: CartStore) => s.addItem;
export const selectRemoveItem = (s: CartStore) => s.removeItem;
export const selectUpdateQuantity = (s: CartStore) => s.updateQuantity;
export const selectClear = (s: CartStore) => s.clear;
export const selectSetOpen = (s: CartStore) => s.setOpen;

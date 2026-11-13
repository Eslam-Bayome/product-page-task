export type CartItem = {
  /** `${productId}:${variantId}` — one line per purchasable variant. */
  lineId: string;
  productId: string;
  variantId: string | null;
  name: string;
  image: string;
  /** Selected variation values, e.g. `{ color: "brown", size: "40" }`. */
  options: Record<string, string>;
  unitPrice: number;
  compareAtPrice: number | null;
  quantity: number;
  /** Stock / per-line cap captured when the item was added. */
  maxQuantity: number;
};

export type AddToCartInput = Omit<CartItem, "lineId" | "quantity">;

export type AddItemResult = {
  lineId: string;
  /** Line quantity after the add. */
  quantity: number;
  /** True when the requested quantity was reduced to `maxQuantity`. */
  clamped: boolean;
};

export type CartState = {
  items: CartItem[];
  /** Drawer visibility — UI state, never persisted. */
  isOpen: boolean;
};

export type CartActions = {
  addItem: (input: AddToCartInput, quantity?: number) => AddItemResult;
  removeItem: (lineId: string) => void;
  /** Clamped to [1, maxQuantity]; removal is always explicit. */
  updateQuantity: (lineId: string, quantity: number) => void;
  clear: () => void;
  setOpen: (isOpen: boolean) => void;
  reset: () => void;
};

export type CartStore = CartState & CartActions;

import {
  makeSelectLine,
  selectIsEmpty,
  selectItemCount,
  selectSavings,
  selectSubtotal,
} from "./cart.selectors";
import { CART_STORAGE_KEY, toLineId, useCartStore } from "./cart.store";
import type { AddToCartInput } from "./cart.types";

const shoe = (overrides: Partial<AddToCartInput> = {}): AddToCartInput => ({
  productId: "p1",
  variantId: "v-brown-40",
  name: "Achilles Pro",
  image: "https://cdn.test/1.webp",
  options: { color: "brown", size: "40" },
  unitPrice: 160,
  compareAtPrice: 190,
  maxQuantity: 10,
  ...overrides,
});

const state = () => useCartStore.getState();

beforeEach(() => {
  state().reset();
  localStorage.clear();
});

describe("addItem", () => {
  it("adds a new line keyed by product and variant", () => {
    const result = state().addItem(shoe(), 2);

    expect(result).toEqual({
      lineId: "p1:v-brown-40",
      quantity: 2,
      clamped: false,
    });
    expect(state().items).toHaveLength(1);
    expect(state().items[0]).toMatchObject({
      lineId: "p1:v-brown-40",
      quantity: 2,
    });
  });

  it("merges the same variant into one line", () => {
    state().addItem(shoe(), 2);
    state().addItem(shoe(), 3);

    expect(state().items).toHaveLength(1);
    expect(state().items[0]?.quantity).toBe(5);
  });

  it("keeps different variants on separate lines", () => {
    state().addItem(shoe());
    state().addItem(shoe({ variantId: "v-black-40" }));

    expect(state().items.map((item) => item.lineId)).toEqual([
      "p1:v-brown-40",
      "p1:v-black-40",
    ]);
  });

  it("clamps to maxQuantity and reports it", () => {
    state().addItem(shoe({ maxQuantity: 3 }), 2);
    const result = state().addItem(shoe({ maxQuantity: 3 }), 5);

    expect(result).toMatchObject({ quantity: 3, clamped: true });
    expect(state().items[0]?.quantity).toBe(3);
  });

  it("refreshes the price snapshot on re-add", () => {
    state().addItem(shoe());
    state().addItem(shoe({ unitPrice: 150 }));

    expect(state().items[0]?.unitPrice).toBe(150);
  });

  it("uses a stable line id for products without variants", () => {
    expect(toLineId("p1", null)).toBe("p1:default");
  });
});

describe("quantity updates", () => {
  const lineId = "p1:v-brown-40";

  beforeEach(() => {
    state().addItem(shoe({ maxQuantity: 4 }), 2);
  });

  it("updates within [1, maxQuantity]", () => {
    state().updateQuantity(lineId, 3);
    expect(state().items[0]?.quantity).toBe(3);

    state().updateQuantity(lineId, 99);
    expect(state().items[0]?.quantity).toBe(4);

    state().updateQuantity(lineId, 0);
    expect(state().items[0]?.quantity).toBe(1);
  });

  it("ignores unknown lines", () => {
    state().updateQuantity("missing", 3);
    expect(state().items[0]?.quantity).toBe(2);
  });
});

describe("remove / clear", () => {
  it("removes one line and clears all", () => {
    state().addItem(shoe());
    state().addItem(shoe({ variantId: "v-black-40" }));

    state().removeItem("p1:v-brown-40");
    expect(state().items.map((item) => item.lineId)).toEqual(["p1:v-black-40"]);

    state().clear();
    expect(selectIsEmpty(state())).toBe(true);
  });
});

describe("selectors", () => {
  it("computes count, subtotal and savings", () => {
    state().addItem(shoe(), 2); // 2 × 160, was 190
    state().addItem(
      shoe({ variantId: "v-black-40", unitPrice: 99.99, compareAtPrice: null }),
      3,
    );

    expect(selectItemCount(state())).toBe(5);
    expect(selectSubtotal(state())).toBe(619.97);
    expect(selectSavings(state())).toBe(60);
    expect(makeSelectLine("p1:v-black-40")(state())?.quantity).toBe(3);
  });

  it("returns zeros for an empty cart", () => {
    expect(selectItemCount(state())).toBe(0);
    expect(selectSubtotal(state())).toBe(0);
    expect(selectIsEmpty(state())).toBe(true);
  });
});

describe("drawer state", () => {
  it("opens and closes", () => {
    state().setOpen(true);
    expect(state().isOpen).toBe(true);
    state().setOpen(false);
    expect(state().isOpen).toBe(false);
  });
});

describe("persistence", () => {
  it("persists only the items, not the drawer state", () => {
    state().addItem(shoe());
    state().setOpen(true);

    const stored = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? "{}");
    expect(stored.version).toBe(1);
    expect(stored.state).toEqual({ items: state().items });
    expect(stored.state).not.toHaveProperty("isOpen");
  });

  it("rehydrates items from storage", async () => {
    state().addItem(shoe(), 4);
    const snapshot = localStorage.getItem(CART_STORAGE_KEY);

    useCartStore.setState({ items: [] });
    localStorage.setItem(CART_STORAGE_KEY, snapshot ?? "");
    await useCartStore.persist.rehydrate();

    expect(selectItemCount(state())).toBe(4);
  });
});

import { makeSelectIsWishlisted } from "./wishlist.selectors";
import { WISHLIST_STORAGE_KEY, useWishlistStore } from "./wishlist.store";

const state = () => useWishlistStore.getState();

beforeEach(() => {
  state().reset();
  localStorage.clear();
});

it("toggles a product in and out", () => {
  state().toggle("p1");
  expect(makeSelectIsWishlisted("p1")(state())).toBe(true);

  state().toggle("p1");
  expect(makeSelectIsWishlisted("p1")(state())).toBe(false);
});

it("persists the saved ids", () => {
  state().toggle("p1");
  const stored = JSON.parse(localStorage.getItem(WISHLIST_STORAGE_KEY) ?? "{}");
  expect(stored.state).toEqual({ productIds: ["p1"] });
});

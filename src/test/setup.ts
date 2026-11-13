import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

import { useCartStore } from "@store/cart";
import { usePreferencesStore } from "@store/preferences";
import { useWishlistStore } from "@store/wishlist";

// jsdom lacks matchMedia; sonner's Toaster reads it for the color scheme.
window.matchMedia ??= (query: string) =>
  ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }) as MediaQueryList;

afterEach(() => {
  cleanup();
  useCartStore.getState().reset();
  useWishlistStore.getState().reset();
  usePreferencesStore.getState().reset();
  localStorage.clear();
});

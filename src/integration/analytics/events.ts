import type { DisplayCurrency, Locale } from "@store/preferences";

/**
 * The tracking plan. Events are snake_case `<entity>_<past-tense verb>`;
 * props send ids and enum values, never display labels or personal data.
 * Prices are always USD (`*_usd`), whatever currency is on screen.
 */
export interface AnalyticsEvents {
  product_viewed: {
    product_id: string;
    product_name: string;
    price_usd: number;
    on_sale: boolean;
  };
  add_to_cart_blocked: {
    reason: "missing_variation" | "unavailable";
    variation: string | null;
  };
  product_added_to_cart: {
    product_id: string;
    variant_id: string | null;
    quantity: number;
    price_usd: number;
    source: "add_to_cart" | "checkout_now";
    /** The line hit the stock / per-line limit. */
    clamped: boolean;
  };
  cart_item_removed: { product_id: string; variant_id: string | null };
  checkout_started: { item_count: number; subtotal_usd: number };
  wishlist_toggled: { product_id: string; saved: boolean };
  product_shared: { method: "native" | "clipboard" };
  language_changed: { language: Locale };
  currency_changed: { currency: DisplayCurrency };
  /** Never carries the email. */
  newsletter_subscribed: Record<string, never>;
}

/** Stamped on every event. */
export interface SuperProperties {
  language: Locale;
  currency: DisplayCurrency;
}

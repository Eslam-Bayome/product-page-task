export const API_URL =
  import.meta.env.VITE_API_URL ?? "https://api.easy-orders.net";

export const STORE_SLUG = import.meta.env.VITE_STORE_SLUG ?? "clear-theme";

export const PRODUCT_SLUG = import.meta.env.VITE_PRODUCT_SLUG ?? "Sneakers12";

export const RATES_API_URL =
  import.meta.env.VITE_RATES_API_URL ?? "https://open.er-api.com";

/** Where events go: `console` (default in dev), `mixpanel` or `off` (default
 *  in production builds). */
export const ANALYTICS_MODE =
  // `||`: an empty value in `.env` means unset too.
  import.meta.env.VITE_ANALYTICS_MODE ||
  (import.meta.env.DEV && import.meta.env.MODE !== "test" ? "console" : "off");

/** Required for `mixpanel` mode; without it nothing is sent. */
export const MIXPANEL_TOKEN = import.meta.env.VITE_MIXPANEL_TOKEN || undefined;

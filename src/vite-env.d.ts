/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_STORE_SLUG?: string;
  readonly VITE_PRODUCT_SLUG?: string;
  readonly VITE_RATES_API_URL?: string;
  readonly VITE_ANALYTICS_MODE?: "console" | "mixpanel" | "off";
  readonly VITE_MIXPANEL_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

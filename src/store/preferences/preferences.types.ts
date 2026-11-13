export type Locale = "en" | "ar";

/** Display currency; prices themselves are always stored in USD. */
export type DisplayCurrency = "USD" | "EGP";

export type PreferencesState = {
  locale: Locale;
  currency: DisplayCurrency;
};

export type PreferencesActions = {
  setLocale: (locale: Locale) => void;
  setCurrency: (currency: DisplayCurrency) => void;
  reset: () => void;
};

export type PreferencesStore = PreferencesState & PreferencesActions;

import type { PreferencesStore } from "./preferences.types";

export const selectLocale = (s: PreferencesStore) => s.locale;
export const selectCurrency = (s: PreferencesStore) => s.currency;

export const selectSetLocale = (s: PreferencesStore) => s.setLocale;
export const selectSetCurrency = (s: PreferencesStore) => s.setCurrency;

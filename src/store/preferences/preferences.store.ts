import { createJSONStorage } from "zustand/middleware";

import type { PreferencesState, PreferencesStore } from "./preferences.types";
import { createPersistedStore } from "../libs/create-store";

export const PREFERENCES_STORAGE_KEY = "preferences";

const initial: PreferencesState = {
  locale: "en",
  currency: "USD",
};

export const usePreferencesStore = createPersistedStore<PreferencesStore>(
  PREFERENCES_STORAGE_KEY,
  (set) => ({
    ...initial,

    setLocale: (locale) =>
      set((s) => {
        s.locale = locale;
      }),

    setCurrency: (currency) =>
      set((s) => {
        s.currency = currency;
      }),

    reset: () => set(() => initial),
  }),
  {
    storage: createJSONStorage(() => localStorage),
    partialize: (s) => ({ locale: s.locale, currency: s.currency }),
    version: 1,
  },
);

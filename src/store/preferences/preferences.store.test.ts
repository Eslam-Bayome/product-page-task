import {
  PREFERENCES_STORAGE_KEY,
  usePreferencesStore,
} from "./preferences.store";

const state = () => usePreferencesStore.getState();

beforeEach(() => {
  state().reset();
  localStorage.clear();
});

it("defaults to English and USD", () => {
  expect(state()).toMatchObject({ locale: "en", currency: "USD" });
});

it("persists the chosen locale and currency", () => {
  state().setLocale("ar");
  state().setCurrency("EGP");

  const stored = JSON.parse(
    localStorage.getItem(PREFERENCES_STORAGE_KEY) ?? "{}",
  );
  expect(stored.state).toEqual({ locale: "ar", currency: "EGP" });
});

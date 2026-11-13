import ar from "@messages/ar.json";
import en from "@messages/en.json";

import { type Locale } from "@store/preferences";

export const MESSAGES = { en, ar } satisfies Record<Locale, typeof en>;

/** The Intl tag per app locale — Arabic keeps Western digits (0-9). */
export const INTL_LOCALE: Record<Locale, string> = {
  en: "en-US",
  ar: "ar-EG-u-nu-latn",
};

export const DIRECTION: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  ar: "rtl",
};

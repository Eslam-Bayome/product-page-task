import { useCallback } from "react";

import { INTL_LOCALE } from "@/i18n";
import { useGetExchangeRates } from "@integration/services/rates";
import { formatMoney } from "@lib/product";
import {
  selectCurrency,
  selectLocale,
  usePreferencesStore,
} from "@store/preferences";

/**
 * The one place prices are converted and formatted. Every amount in the app
 * (API, mock data, cart) is USD; this turns it into the shopper's display
 * currency and locale. Until a non-USD rate is available it shows USD.
 */
export const useFormatPrice = () => {
  const currency = usePreferencesStore(selectCurrency);
  const locale = INTL_LOCALE[usePreferencesStore(selectLocale)];
  const { data } = useGetExchangeRates("USD", currency !== "USD");

  const rate = currency === "USD" ? 1 : data?.rates[currency];

  return useCallback(
    (usd: number) =>
      rate === undefined
        ? formatMoney(usd, "USD", locale)
        : formatMoney(usd * rate, currency, locale),
    [rate, currency, locale],
  );
};

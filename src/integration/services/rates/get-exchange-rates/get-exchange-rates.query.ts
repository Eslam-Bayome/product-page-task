import { queryOptions } from "@tanstack/react-query";

import { Keys } from "@integration/keys";

import { getExchangeRatesAction } from "./get-exchange-rates.action";

const HOUR_MS = 60 * 60 * 1000;

export const exchangeRatesQueryOptions = (base: string) =>
  queryOptions({
    queryKey: [Keys.rates.latest, base],
    queryFn: async ({ signal }) => {
      const { data, error } = await getExchangeRatesAction(base, signal);
      if (error) throw error;
      return data;
    },
    // The provider refreshes once a day; an hour keeps tabs reasonably fresh.
    staleTime: HOUR_MS,
  });

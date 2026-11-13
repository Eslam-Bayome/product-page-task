import { useQuery } from "@tanstack/react-query";

import { exchangeRatesQueryOptions } from "./get-exchange-rates.query";

/** Rates per one unit of `base`; only fetched while `enabled`. */
export const useGetExchangeRates = (base = "USD", enabled = true) =>
  useQuery({ ...exchangeRatesQueryOptions(base), enabled });

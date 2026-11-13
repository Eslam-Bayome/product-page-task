import { ApiError } from "@integration/api/api-error";
import { RatesBackend } from "@integration/api/backends";
import { tryCatch } from "@integration/api/try-catch";
import { endPoints } from "@integration/end-points";
import { type ExchangeRates } from "@integration/types";

const fetchRates = async (base: string, signal?: AbortSignal) => {
  const body = await RatesBackend.get<ExchangeRates>(
    endPoints.rates.latest.replace(":base", encodeURIComponent(base)),
    { signal },
  );
  // The API answers 200 with `result: "error"` for bad requests.
  if (body.result !== "success") {
    throw new ApiError(body["error-type"] ?? "Rates unavailable", 502, {
      base,
    });
  }
  return body;
};

export const getExchangeRatesAction = (base: string, signal?: AbortSignal) =>
  tryCatch(fetchRates(base, signal));

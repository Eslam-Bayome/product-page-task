/** `GET /v6/latest/:base` from open.er-api.com. */
export type ExchangeRates = {
  result: "success" | "error";
  base_code: string;
  /** Units of each currency per one `base_code`. */
  rates: Record<string, number>;
  time_last_update_utc: string;
  "error-type"?: string;
};

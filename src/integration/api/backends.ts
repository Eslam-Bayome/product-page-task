import { API_URL, RATES_API_URL } from "@config/env";

import { API_VERSION } from "./constants";
import { createHttpClient } from "./http-client";

/** The public EasyOrders storefront API. */
export const EasyOrdersBackend = createHttpClient(`${API_URL}${API_VERSION}`);

/** Daily currency rates (open.er-api.com, no key needed). */
export const RatesBackend = createHttpClient(RATES_API_URL);

import { ApiError } from "./api-error";
import { REQUEST_TIMEOUT_MS } from "./constants";
import { filterParams, type ParamValue } from "./filter-params";

type RequestOptions = Omit<RequestInit, "body" | "method"> & {
  params?: Record<string, ParamValue>;
};

const buildUrl = (
  baseUrl: string,
  path: string,
  params: RequestOptions["params"],
) => {
  const url = new URL(`${baseUrl}${path}`);
  const query = new URLSearchParams(filterParams(params));
  query.forEach((value, key) => url.searchParams.set(key, value));
  return url.toString();
};

const readErrorMessage = async (response: Response) => {
  try {
    const body = (await response.json()) as { message?: string };
    return body.message ?? response.statusText;
  } catch {
    return response.statusText || "Request failed";
  }
};

const request = async <T>(
  baseUrl: string,
  method: string,
  path: string,
  { params, signal, headers, ...init }: RequestOptions = {},
): Promise<T> => {
  // Respect the caller's signal (React Query cancellation) and the timeout.
  const timeout = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
  const combinedSignal = signal ? AbortSignal.any([signal, timeout]) : timeout;

  let response: Response;
  try {
    response = await fetch(buildUrl(baseUrl, path, params), {
      ...init,
      method,
      signal: combinedSignal,
      headers: { Accept: "application/json", ...headers },
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "TimeoutError") {
      throw new ApiError("The request timed out. Please try again.", 408);
    }
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }
    throw new ApiError("Network error. Check your connection.", 0, {
      cause: error,
    });
  }

  if (!response.ok) {
    throw new ApiError(await readErrorMessage(response), response.status, {
      path,
    });
  }

  return (await response.json()) as T;
};

/**
 * Thin `fetch` client for a JSON API at `baseUrl`. Responses are returned
 * as-is; non-OK responses and network/timeout failures surface as
 * `ApiError`, and the caller's abort signal is combined with the timeout.
 */
export const createHttpClient = (baseUrl: string) => ({
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(baseUrl, "GET", path, options),
});

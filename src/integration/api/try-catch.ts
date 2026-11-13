import { ApiError } from "./api-error";

export type ActionResult<T> =
  { data: T; error: null } | { data: null; error: ApiError };

/** Normalises any thrown value into an `ApiError` so callers branch on one shape. */
export const tryCatch = async <T>(
  promise: Promise<T>,
): Promise<ActionResult<T>> => {
  try {
    return { data: await promise, error: null };
  } catch (error) {
    if (error instanceof ApiError) return { data: null, error };
    const message = error instanceof Error ? error.message : "Unexpected error";
    return { data: null, error: new ApiError(message, 0, { cause: error }) };
  }
};

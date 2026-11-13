type ParamValue = string | number | boolean | null | undefined;

/** Drops undefined, null and empty-string params so they never hit the URL. */
export const filterParams = (params: Record<string, ParamValue> = {}) =>
  Object.fromEntries(
    Object.entries(params)
      .filter(
        ([, value]) => value !== undefined && value !== null && value !== "",
      )
      .map(([key, value]) => [key, String(value)]),
  );

export type { ParamValue };

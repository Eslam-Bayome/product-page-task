const formatters = new Map<string, Intl.NumberFormat>();

/**
 * Currency formatting, cached per locale + currency —
 * `Intl.NumberFormat` construction is comparatively expensive.
 */
export const formatMoney = (
  amount: number,
  currency: string,
  locale: string,
) => {
  const key = `${locale}:${currency}`;
  let formatter = formatters.get(key);
  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    formatters.set(key, formatter);
  }
  return formatter.format(amount);
};

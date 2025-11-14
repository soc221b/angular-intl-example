export const formatCurrency = (
  value: number,
  locale: string,
  currency: string,
): Intl.NumberFormatPart[] => {
  return Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).formatToParts(value);
};

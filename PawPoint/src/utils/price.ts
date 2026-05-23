export type CurrencyPreference = "EUR" | "RON";

const EUR_TO_RON = 5;

export const formatConvertedPrice = (
  price?: number | null,
  sourceCurrency?: number | "EUR" | "RON",
  targetCurrency: CurrencyPreference = "EUR"
) => {
  if (price == null) return "—";

  const source =
    sourceCurrency === 2 || sourceCurrency === "RON" ? "RON" : "EUR";

  let converted = price;

  if (source === "EUR" && targetCurrency === "RON") {
    converted = price * EUR_TO_RON;
  }

  if (source === "RON" && targetCurrency === "EUR") {
    converted = price / EUR_TO_RON;
  }

  return `${converted.toFixed(2)} ${targetCurrency}`;
};
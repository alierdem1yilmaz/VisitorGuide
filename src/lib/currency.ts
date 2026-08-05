const FRANKFURTER_URL = "https://api.frankfurter.dev/v1/latest?base=USD";

// Frankfurter (ECB-backed, free, no API key) covers ~30 major currencies.
// Any currency outside that set falls back to no conversion (amount stays
// in USD) rather than failing the page.
export async function getExchangeRates(): Promise<Record<string, number>> {
  try {
    const res = await fetch(FRANKFURTER_URL, { next: { revalidate: 3600 } });
    if (!res.ok) return {};
    const data = await res.json();
    return { USD: 1, ...(data.rates as Record<string, number>) };
  } catch {
    return {};
  }
}

export function convertFromUsd(
  amountUsd: number,
  targetCurrency: string,
  rates: Record<string, number>,
): { amount: number; currency: string } {
  const rate = rates[targetCurrency];
  if (!rate) return { amount: amountUsd, currency: "USD" };
  return { amount: Math.round(amountUsd * rate), currency: targetCurrency };
}

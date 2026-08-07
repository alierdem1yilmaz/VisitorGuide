import { Category } from "../src/generated/prisma/client";

// Baseline USD price per category at priceLevel 2 / "moderate" cost-of-living
// (restaurant = meal for two, hotel = per night, attraction/monument/nature =
// per-person entry fee). These are deliberately round, order-of-magnitude
// estimates — there is no live pricing data source wired up (see VisitorGuide
// plan notes), so every place's priceAmount is a formula-derived estimate,
// never a scraped or researched real price.
const CATEGORY_BASE_USD: Record<Category, number> = {
  [Category.RESTAURANT]: 35,
  [Category.ATTRACTION]: 18,
  [Category.MONUMENT]: 15,
  [Category.HOTEL]: 110,
  [Category.NATURE]: 8,
};

function levelMultiplier(priceLevel: number | null): number {
  switch (priceLevel) {
    case 1:
      return 0.5;
    case 2:
      return 1;
    case 3:
      return 1.75;
    case 4:
      return 3;
    default:
      return 0.4;
  }
}

// Rough relative cost-of-living multiplier per country (1.0 = moderate).
// General real-world tiers, not sourced from a live index.
export const COUNTRY_COST_MULTIPLIER: Record<string, number> = {
  turkiye: 0.45,
  fransa: 1.4,
  italya: 1.25,
  japonya: 1.3,
  ispanya: 1.05,
  abd: 1.5,
  brezilya: 0.55,
  ingiltere: 1.45,
  fas: 0.4,
  yunanistan: 0.9,
  cin: 0.65,
  meksika: 0.5,
  almanya: 1.3,
  tayland: 0.45,
  avusturya: 1.3,
  kanada: 1.35,
  polonya: 0.6,
  rusya: 0.55,
  hollanda: 1.35,
  portekiz: 0.85,
  macaristan: 0.6,
  hirvatistan: 0.75,
  bae: 1.4,
  hindistan: 0.3,
  endonezya: 0.4,
  vietnam: 0.35,
  misir: 0.3,
  "guney-kore": 1.1,
  cekya: 0.7,
  isvicre: 2.0,
  arjantin: 0.5,
  belcika: 1.3,
  bolivya: 0.3,
  danimarka: 1.6,
  ekvador: 0.45,
  filipinler: 0.35,
  "guney-afrika": 0.4,
  irlanda: 1.4,
  israil: 1.35,
  isvec: 1.35,
  izlanda: 1.9,
  kambocya: 0.3,
  kenya: 0.4,
  kolombiya: 0.4,
  malezya: 0.45,
  mauritius: 0.6,
  namibya: 0.45,
  nepal: 0.25,
  norvec: 1.8,
  peru: 0.4,
  romanya: 0.55,
  seyseller: 1.1,
  sili: 0.6,
  singapur: 1.3,
  slovenya: 0.85,
  "sri-lanka": 0.3,
  tanzanya: 0.45,
  tunus: 0.35,
  urdun: 0.55,
  uruguay: 0.75,
  zimbabve: 0.4,
};

function roundNicely(amount: number): number {
  if (amount < 20) return Math.round(amount);
  if (amount < 100) return Math.round(amount / 5) * 5;
  return Math.round(amount / 10) * 10;
}

export function estimatePriceUsd(
  category: Category,
  priceLevel: number | null,
  countrySlug: string,
): number {
  const base = CATEGORY_BASE_USD[category];
  const multiplier = levelMultiplier(priceLevel);
  const costOfLiving = COUNTRY_COST_MULTIPLIER[countrySlug] ?? 1;
  return roundNicely(base * multiplier * costOfLiving);
}

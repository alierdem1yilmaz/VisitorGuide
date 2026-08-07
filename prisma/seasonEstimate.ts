import { Category, Season } from "@prisma/client";

// Extreme-summer-heat, desert-climate countries where the real tourist
// season is winter (Nov-Mar) — outdoor/nature spots there (including
// beaches) are winter-best, not summer-best like temperate coastal
// destinations.
const DESERT_WINTER_COUNTRIES = new Set(["bae", "fas", "misir"]);

const WINTER_KEYWORDS = [
  "ski",
  "snowboard",
  "glacier",
  "buzul",
  "piste",
  "chairlift",
  "aurora",
  "northern lights",
  "kuzey ışıkları",
];

const SUMMER_KEYWORDS = [
  "beach",
  "plaj",
  "sahil",
  "coast",
  "bay",
  "lagoon",
  "lagün",
  "cove",
  "seaside",
  "marina",
  "riviera",
  "reef",
  "resif",
  "surf",
  "snorkel",
  "dalış",
];

export function inferBestSeason(
  category: Category,
  name: string,
  description: string | null,
  countrySlug: string,
): Season {
  if (category !== Category.NATURE && category !== Category.ATTRACTION) {
    return Season.ALL;
  }

  const text = `${name} ${description ?? ""}`.toLowerCase();
  const isDesertWinterCity = DESERT_WINTER_COUNTRIES.has(countrySlug);

  if (WINTER_KEYWORDS.some((k) => text.includes(k))) return Season.WINTER;
  if (isDesertWinterCity) return Season.WINTER;
  if (SUMMER_KEYWORDS.some((k) => text.includes(k))) return Season.SUMMER;
  if (category === Category.NATURE) return Season.SUMMER;
  return Season.ALL;
}

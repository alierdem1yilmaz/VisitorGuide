import fs from "fs";
import path from "path";
import { Category } from "../src/generated/prisma/client";
import { countries } from "../prisma/seed";

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
if (!API_KEY) {
  throw new Error("GOOGLE_PLACES_API_KEY is not set");
}

const OUTPUT_DIR = path.join(__dirname, "..", "prisma", "placesData");
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.location",
  "places.rating",
  "places.userRatingCount",
  "places.priceLevel",
  "places.regularOpeningHours.weekdayDescriptions",
  "places.websiteUri",
  "places.internationalPhoneNumber",
  "places.photos",
  "places.editorialSummary",
].join(",");

type CategoryConfig = {
  category: Category;
  query: (city: string, country: string) => string;
  targetCount: number;
};

const CATEGORY_CONFIGS: CategoryConfig[] = [
  {
    category: Category.ATTRACTION,
    query: (city, country) => `top tourist attractions in ${city}, ${country}`,
    targetCount: 16,
  },
  {
    category: Category.MONUMENT,
    query: (city, country) => `historical landmarks and monuments in ${city}, ${country}`,
    targetCount: 10,
  },
  {
    category: Category.RESTAURANT,
    query: (city, country) => `best restaurants in ${city}, ${country}`,
    targetCount: 14,
  },
  {
    category: Category.HOTEL,
    query: (city, country) => `best hotels in ${city}, ${country}`,
    targetCount: 8,
  },
  {
    category: Category.NATURE,
    query: (city, country) => `parks and natural landmarks near ${city}, ${country}`,
    targetCount: 10,
  },
];

const MAX_PHOTOS_PER_PLACE = 5;

type GooglePlaceResult = {
  id: string;
  displayName?: { text: string };
  formattedAddress?: string;
  location?: { latitude: number; longitude: number };
  rating?: number;
  userRatingCount?: number;
  priceLevel?: string;
  regularOpeningHours?: { weekdayDescriptions?: string[] };
  websiteUri?: string;
  internationalPhoneNumber?: string;
  photos?: { name: string }[];
  editorialSummary?: { text: string };
};

type FetchedPlace = {
  googlePlaceId: string;
  slug: string;
  name: string;
  category: Category;
  description: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  priceLevel: number | null;
  avgRating: number;
  reviewCount: number;
  openingHours: Record<string, string> | null;
  website: string | null;
  phone: string | null;
  photoUrls: string[];
};

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// Strips diacritics (İstanbul's "ü"/"ç"/"ı" etc.) so name comparisons and
// slugs agree on what counts as "the same word" — an earlier version only
// diacritic-folded in slugify(), which let e.g. "Düden Waterfalls" (curated)
// and "Duden Waterfalls" (Google) look different enough to dedup as distinct
// while still slugifying to the same string, silently overwriting curated
// content at merge time.
function foldDiacritics(value: string): string {
  return value.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function normalizeTokens(name: string): Set<string> {
  return new Set(
    foldDiacritics(name)
      .toLowerCase()
      .replace(/[()]/g, " ")
      .replace(/[^a-z0-9\s]/g, "")
      .split(/\s+/)
      .filter(Boolean),
  );
}

// Google's returned names often differ slightly from our hand-curated ones
// ("Hagia Sophia" vs "Hagia Sophia Grand Mosque"), so exact-string matching
// would let true duplicates through. Substring containment catches
// suffixed/prefixed variants; token-overlap ratio catches reordered/partial
// matches. Threshold is deliberately conservative (favors missing a
// borderline new place over showing users two cards for the same place).
function isLikelyDuplicate(nameA: string, nameB: string): boolean {
  const a = foldDiacritics(nameA).toLowerCase().trim();
  const b = foldDiacritics(nameB).toLowerCase().trim();
  if (a === b) return true;
  if (a.length > 3 && b.length > 3 && (a.includes(b) || b.includes(a))) return true;

  const setA = normalizeTokens(nameA);
  const setB = normalizeTokens(nameB);
  const minSize = Math.min(setA.size, setB.size);
  if (minSize === 0) return false;
  const intersection = [...setA].filter((w) => setB.has(w)).length;
  return intersection / minSize >= 0.6;
}

// Always city-scoped: two different cities can easily produce the same
// generic landmark name (e.g. Rome's and Venice's own "Monument to Victor
// Emmanuel II"), and Place.slug is globally unique — an earlier version
// only disambiguated on same-city collisions, so cross-city collisions
// silently overwrote one another at upsert time.
function slugify(name: string, citySlug: string): string {
  const base = foldDiacritics(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${base}-${citySlug}`;
}

function mapPriceLevel(level: string | undefined): number | null {
  switch (level) {
    case "PRICE_LEVEL_INEXPENSIVE":
      return 1;
    case "PRICE_LEVEL_MODERATE":
      return 2;
    case "PRICE_LEVEL_EXPENSIVE":
      return 3;
    case "PRICE_LEVEL_VERY_EXPENSIVE":
      return 4;
    default:
      return null;
  }
}

function mapOpeningHours(
  weekdayDescriptions: string[] | undefined,
): Record<string, string> | null {
  if (!weekdayDescriptions || weekdayDescriptions.length === 0) return null;
  const result: Record<string, string> = {};
  for (const line of weekdayDescriptions) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const day = line.slice(0, idx).trim();
    const hours = line.slice(idx + 1).trim();
    result[day] = hours;
  }
  return Object.keys(result).length > 0 ? result : null;
}

async function searchText(
  query: string,
  lat: number | null,
  lng: number | null,
): Promise<GooglePlaceResult[]> {
  const url = "https://places.googleapis.com/v1/places:searchText";
  const body: Record<string, unknown> = { textQuery: query, maxResultCount: 20 };
  if (lat != null && lng != null) {
    body.locationBias = {
      circle: { center: { latitude: lat, longitude: lng }, radius: 15000 },
    };
  }
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": API_KEY!,
      "X-Goog-FieldMask": FIELD_MASK,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`searchText failed (${res.status}): ${text}`);
  }
  const data = await res.json();
  return data.places ?? [];
}

async function fetchPhotoUrl(photoName: string): Promise<string | null> {
  try {
    const url = `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=1000&skipHttpRedirect=true&key=${API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    return data.photoUri ?? null;
  } catch {
    return null;
  }
}

async function fetchCity(
  citySlug: string,
  cityName: string,
  countryName: string,
  lat: number | null,
  lng: number | null,
  existingNames: string[],
) {
  const outputPath = path.join(OUTPUT_DIR, `${citySlug}.json`);
  const usedSlugs = new Set<string>();
  const usedNames: string[] = [...existingNames];
  const results: FetchedPlace[] = [];

  for (const config of CATEGORY_CONFIGS) {
    const query = config.query(cityName, countryName);
    let places: GooglePlaceResult[] = [];
    try {
      places = await searchText(query, lat, lng);
    } catch (err) {
      console.error(`  [${citySlug}] ${config.category} search failed:`, err);
      continue;
    }
    await sleep(250);

    let kept = 0;
    for (const p of places) {
      if (kept >= config.targetCount) break;
      const name: string = p.displayName?.text ?? "";
      if (!name) continue;
      if (usedNames.some((existing) => isLikelyDuplicate(existing, name))) continue;

      const slug = slugify(name, citySlug);
      if (slug === `-${citySlug}`) continue;
      if (usedSlugs.has(slug)) continue;

      const photoUrls: string[] = [];
      for (const photo of (p.photos ?? []).slice(0, MAX_PHOTOS_PER_PLACE)) {
        const url = await fetchPhotoUrl(photo.name);
        await sleep(150);
        if (url) photoUrls.push(url);
      }

      results.push({
        googlePlaceId: p.id,
        slug,
        name,
        category: config.category,
        description: p.editorialSummary?.text ?? null,
        address: p.formattedAddress ?? null,
        latitude: p.location?.latitude ?? null,
        longitude: p.location?.longitude ?? null,
        priceLevel: mapPriceLevel(p.priceLevel),
        avgRating: typeof p.rating === "number" ? p.rating : 0,
        reviewCount: typeof p.userRatingCount === "number" ? p.userRatingCount : 0,
        openingHours: mapOpeningHours(p.regularOpeningHours?.weekdayDescriptions),
        website: p.websiteUri ?? null,
        phone: p.internationalPhoneNumber ?? null,
        photoUrls,
      });
      usedSlugs.add(slug);
      usedNames.push(name);
      kept++;
    }
    console.log(`  [${citySlug}] ${config.category}: +${kept} (query: "${query}")`);
  }

  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2) + "\n", "utf8");
  console.log(
    `[${citySlug}] wrote ${results.length} new places (existing: ${existingNames.length}) -> ${outputPath}`,
  );
  return results.length;
}

async function main() {
  const argCitySlugs = process.argv.slice(2);

  const cityList = countries.flatMap((country) =>
    country.cities.map((city) => ({
      citySlug: city.slug,
      cityName: city.name,
      countryName: country.name,
      lat: city.latitude ?? null,
      lng: city.longitude ?? null,
      existingNames: city.places.map((p) => p.name),
    })),
  );

  const targets = argCitySlugs.length
    ? cityList.filter((c) => argCitySlugs.includes(c.citySlug))
    : cityList;

  console.log(`Fetching places for ${targets.length} cities...`);

  let totalNew = 0;
  for (const city of targets) {
    const count = await fetchCity(
      city.citySlug,
      city.cityName,
      city.countryName,
      city.lat,
      city.lng,
      city.existingNames,
    );
    totalNew += count;
  }
  console.log(`Done. Total new places fetched: ${totalNew}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

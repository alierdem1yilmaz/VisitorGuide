import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { countries } from "../prisma/seed";

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
if (!API_KEY) {
  throw new Error("GOOGLE_PLACES_API_KEY is not set");
}

const prisma = new PrismaClient();
const OUTPUT_PATH = path.join(__dirname, "..", "prisma", "curatedPlaceRatings.json");

const FIELD_MASK = ["places.id", "places.displayName", "places.rating", "places.userRatingCount"].join(",");

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

type GooglePlaceResult = {
  id: string;
  displayName?: { text: string };
  rating?: number;
  userRatingCount?: number;
};

async function searchText(
  query: string,
  lat: number | null,
  lng: number | null,
): Promise<GooglePlaceResult | null> {
  const url = "https://places.googleapis.com/v1/places:searchText";
  const body: Record<string, unknown> = { textQuery: query, maxResultCount: 1 };
  if (lat != null && lng != null) {
    body.locationBias = {
      circle: { center: { latitude: lat, longitude: lng }, radius: 20000 },
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
    console.error(`  searchText failed (${res.status}): ${await res.text()}`);
    return null;
  }
  const data = await res.json();
  return data.places?.[0] ?? null;
}

async function main() {
  const flatPlaces = countries.flatMap((country) =>
    country.cities.flatMap((city) =>
      city.places.map((place) => ({
        slug: place.slug,
        name: place.name,
        cityName: city.name,
        countryName: country.name,
        lat: city.latitude ?? null,
        lng: city.longitude ?? null,
      })),
    ),
  );

  console.log(`Fetching ratings for ${flatPlaces.length} curated places.`);

  const results: Record<string, { avgRating: number; reviewCount: number }> = {};
  let found = 0;
  let missed = 0;

  for (const place of flatPlaces) {
    const query = `${place.name}, ${place.cityName}, ${place.countryName}`;
    const match = await searchText(query, place.lat, place.lng);
    await sleep(180);

    if (!match || match.rating == null || match.userRatingCount == null) {
      console.log(`  MISS: ${place.slug} ("${query}")`);
      missed++;
      continue;
    }

    results[place.slug] = {
      avgRating: match.rating,
      reviewCount: match.userRatingCount,
    };
    found++;
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(results, null, 2) + "\n", "utf8");
  console.log(`Done. Found: ${found}, missed: ${missed}. Wrote ${OUTPUT_PATH}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

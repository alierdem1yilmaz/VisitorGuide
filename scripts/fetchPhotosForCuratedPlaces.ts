import fs from "fs";
import path from "path";
import { PrismaClient } from "../src/generated/prisma/client";
import { countries } from "../prisma/seed";

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
if (!API_KEY) {
  throw new Error("GOOGLE_PLACES_API_KEY is not set");
}

const prisma = new PrismaClient();
const OUTPUT_PATH = path.join(__dirname, "..", "prisma", "curatedPlacePhotos.json");

const FIELD_MASK = ["places.id", "places.displayName", "places.photos"].join(",");

type GooglePlaceResult = {
  id: string;
  displayName?: { text: string };
  photos?: { name: string }[];
};

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

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

async function main() {
  const picsumPlaces = await prisma.place.findMany({
    where: { photos: { some: { isCover: true, url: { contains: "picsum" } } } },
    select: { slug: true },
  });
  const targetSlugs = new Set(picsumPlaces.map((p) => p.slug));
  console.log(`Targeting ${targetSlugs.size} places currently on a Picsum placeholder.`);

  const flatPlaces = countries.flatMap((country) =>
    country.cities.flatMap((city) =>
      city.places
        .filter((p) => targetSlugs.has(p.slug))
        .map((place) => ({
          slug: place.slug,
          name: place.name,
          cityName: city.name,
          countryName: country.name,
          lat: city.latitude ?? null,
          lng: city.longitude ?? null,
        })),
    ),
  );

  console.log(`Matched ${flatPlaces.length} of ${targetSlugs.size} in curated data.`);

  const results: Record<string, string> = {};
  let found = 0;
  let missed = 0;

  for (const place of flatPlaces) {
    const query = `${place.name}, ${place.cityName}, ${place.countryName}`;
    const match = await searchText(query, place.lat, place.lng);
    await sleep(200);

    if (!match || !match.photos?.[0]?.name) {
      console.log(`  MISS: ${place.slug} ("${query}")`);
      missed++;
      continue;
    }

    const photoUrl = await fetchPhotoUrl(match.photos[0].name);
    await sleep(150);
    if (!photoUrl) {
      console.log(`  MISS (no photo url): ${place.slug}`);
      missed++;
      continue;
    }

    results[place.slug] = photoUrl;
    found++;
    console.log(`  OK: ${place.slug} -> ${match.displayName?.text ?? "?"}`);
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

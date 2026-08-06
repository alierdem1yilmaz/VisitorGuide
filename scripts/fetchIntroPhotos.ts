import fs from "fs";
import path from "path";

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
if (!API_KEY) {
  throw new Error("GOOGLE_PLACES_API_KEY is not set");
}

const OUTPUT_PATH = path.join(__dirname, "..", "prisma", "introPhotos.json");

const CANDIDATES = [
  { slug: "trevi-fountain-roma", name: "Trevi Fountain", cityName: "Rome", countryName: "Italy" },
  { slug: "eiffel-tower", name: "Eiffel Tower", cityName: "Paris", countryName: "France" },
  { slug: "sagrada-familia", name: "Sagrada Família", cityName: "Barcelona", countryName: "Spain" },
  { slug: "zocalo", name: "Zócalo", cityName: "Mexico City", countryName: "Mexico" },
  { slug: "central-park", name: "Central Park", cityName: "New York", countryName: "United States" },
  { slug: "ibirapuera-park", name: "Ibirapuera Park", cityName: "São Paulo", countryName: "Brazil" },
  { slug: "taj-mahal", name: "Taj Mahal", cityName: "Agra", countryName: "India" },
  { slug: "galata-tower-istanbul", name: "Galata Tower", cityName: "Istanbul", countryName: "Turkey" },
  { slug: "prague-castle", name: "Prague Castle", cityName: "Prague", countryName: "Czech Republic" },
  { slug: "brandenburg-gate", name: "Brandenburg Gate", cityName: "Berlin", countryName: "Germany" },
];

const FIELD_MASK = ["places.id", "places.photos"].join(",");

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function searchText(query: string) {
  const url = "https://places.googleapis.com/v1/places:searchText";
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": API_KEY!,
      "X-Goog-FieldMask": FIELD_MASK,
    },
    body: JSON.stringify({ textQuery: query, maxResultCount: 1 }),
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
    const url = `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=1200&skipHttpRedirect=true&key=${API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    return data.photoUri ?? null;
  } catch {
    return null;
  }
}

async function main() {
  const results: {
    slug: string;
    placeName: string;
    cityName: string;
    countryName: string;
    photoUrl: string;
    author: string;
  }[] = [];

  for (const c of CANDIDATES) {
    const query = `${c.name}, ${c.cityName}, ${c.countryName}`;
    const match = await searchText(query);
    await sleep(200);
    const photo = match?.photos?.[0];
    if (!photo?.name) {
      console.log(`  MISS (no photo): ${c.slug}`);
      continue;
    }
    const photoUrl = await fetchPhotoUrl(photo.name);
    await sleep(150);
    if (!photoUrl) {
      console.log(`  MISS (no photo url): ${c.slug}`);
      continue;
    }
    const author = photo.authorAttributions?.[0]?.displayName ?? "Google Maps";
    results.push({
      slug: c.slug,
      placeName: c.name,
      cityName: c.cityName,
      countryName: c.countryName,
      photoUrl,
      author,
    });
    console.log(`  OK: ${c.slug} by ${author}`);
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(results, null, 2) + "\n", "utf8");
  console.log(`Done. ${results.length}/${CANDIDATES.length}. Wrote ${OUTPUT_PATH}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

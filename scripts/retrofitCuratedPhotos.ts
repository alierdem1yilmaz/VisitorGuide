import { PrismaClient } from "@prisma/client";

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
if (!API_KEY) {
  throw new Error("GOOGLE_PLACES_API_KEY is not set");
}

const prisma = new PrismaClient();
const MAX_PHOTOS = 5;

const SEARCH_FIELD_MASK = ["places.id", "places.photos"].join(",");

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function withRetry<T>(fn: () => Promise<T>, retries = 5): Promise<T> {
  for (let attempt = 1; ; attempt++) {
    try {
      return await fn();
    } catch (e) {
      const isTransient =
        e instanceof Error && "code" in e && ["P1017", "P2024"].includes((e as { code: string }).code);
      if (!isTransient || attempt >= retries) throw e;
      await sleep(1000 * attempt);
    }
  }
}

async function searchPlaceId(
  query: string,
  lat: number | null,
  lng: number | null,
): Promise<{ id: string; photos: { name: string }[] } | null> {
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
      "X-Goog-FieldMask": SEARCH_FIELD_MASK,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) return null;
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
  const places = await withRetry(() =>
    prisma.place.findMany({
      where: { photos: { some: {} } },
      include: {
        photos: true,
        city: { include: { country: true } },
      },
    }),
  );

  const targets = places.filter((p) => p.photos.length < MAX_PHOTOS);
  console.log(`Targeting ${targets.length} of ${places.length} places with fewer than ${MAX_PHOTOS} photos.`);

  let processed = 0;
  let photosAdded = 0;
  let missed = 0;

  for (const place of targets) {
    const query = `${place.name}, ${place.city.name}, ${place.city.country.name}`;
    const match = await searchPlaceId(query, place.latitude, place.longitude);
    await sleep(180);

    if (!match || !match.photos?.length) {
      missed++;
      continue;
    }

    const existingUrls = new Set(place.photos.map((ph) => ph.url));
    let placePhotoCount = place.photos.length;
    let addedForPlace = 0;

    for (const photo of match.photos.slice(0, MAX_PHOTOS)) {
      if (placePhotoCount >= MAX_PHOTOS) break;
      const photoUrl = await fetchPhotoUrl(photo.name);
      await sleep(150);
      if (!photoUrl || existingUrls.has(photoUrl) || photoUrl.includes("picsum")) continue;

      await withRetry(() =>
        prisma.photo.create({
          data: {
            id: `${place.id}-${photoUrl}`,
            placeId: place.id,
            url: photoUrl,
            caption: place.name,
            isCover: false,
          },
        }),
      );
      existingUrls.add(photoUrl);
      placePhotoCount++;
      addedForPlace++;
      photosAdded++;
    }

    processed++;
    console.log(`  [${place.slug}] +${addedForPlace} photos (now ${placePhotoCount})`);
  }

  console.log(
    `Done. Processed: ${processed}, photos added: ${photosAdded}, missed (no match): ${missed}.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

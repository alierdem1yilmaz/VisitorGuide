import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
if (!API_KEY) {
  throw new Error("GOOGLE_PLACES_API_KEY is not set");
}

const prisma = new PrismaClient();
const DATA_DIR = path.join(__dirname, "..", "prisma", "placesData");
const MAX_PHOTOS = 5;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchPlacePhotoNames(placeId: string): Promise<string[]> {
  const url = `https://places.googleapis.com/v1/places/${placeId}`;
  const res = await fetch(url, {
    headers: {
      "X-Goog-Api-Key": API_KEY!,
      "X-Goog-FieldMask": "photos",
    },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.photos ?? []).slice(0, MAX_PHOTOS).map((p: { name: string }) => p.name);
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
  const argCitySlugs = process.argv.slice(2);
  const files = fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.endsWith(".json"))
    .filter((f) => argCitySlugs.length === 0 || argCitySlugs.includes(f.replace(".json", "")));

  let totalPlacesProcessed = 0;
  let totalPhotosAdded = 0;

  for (const file of files) {
    const citySlug = file.replace(".json", "");
    const places: { slug: string; googlePlaceId: string; name: string }[] = JSON.parse(
      fs.readFileSync(path.join(DATA_DIR, file), "utf8"),
    );

    let cityPhotosAdded = 0;

    for (const p of places) {
      if (!p.googlePlaceId) continue;

      const dbPlace = await prisma.place.findUnique({
        where: { slug: p.slug },
        include: { photos: true },
      });
      if (!dbPlace) continue;
      if (dbPlace.photos.length >= MAX_PHOTOS) continue;

      const existingUrls = new Set(dbPlace.photos.map((ph) => ph.url));
      const photoNames = await fetchPlacePhotoNames(p.googlePlaceId);
      await sleep(120);

      let placePhotoCount = dbPlace.photos.length;
      for (const photoName of photoNames) {
        if (placePhotoCount >= MAX_PHOTOS) break;
        const photoUrl = await fetchPhotoUrl(photoName);
        await sleep(120);
        if (!photoUrl || existingUrls.has(photoUrl) || photoUrl.includes("picsum")) continue;

        await prisma.photo.create({
          data: {
            id: `${dbPlace.id}-${photoUrl}`,
            placeId: dbPlace.id,
            url: photoUrl,
            caption: p.name,
            isCover: false,
          },
        });
        existingUrls.add(photoUrl);
        placePhotoCount++;
        cityPhotosAdded++;
      }
      totalPlacesProcessed++;
    }

    console.log(`[${citySlug}] processed ${places.length} places, added ${cityPhotosAdded} photos`);
    totalPhotosAdded += cityPhotosAdded;
  }

  console.log(
    `Done. Places processed: ${totalPlacesProcessed}, photos added: ${totalPhotosAdded}`,
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

import fs from "fs";
import path from "path";
import { PrismaClient, Category } from "../src/generated/prisma/client";
import { estimatePriceUsd } from "../prisma/priceEstimate";
import { inferBestSeason } from "../prisma/seasonEstimate";

const prisma = new PrismaClient();
const DATA_DIR = path.join(__dirname, "..", "prisma", "placesData");

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

async function main() {
  const argCitySlugs = process.argv.slice(2);
  const files = fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.endsWith(".json"))
    .filter((f) => argCitySlugs.length === 0 || argCitySlugs.includes(f.replace(".json", "")));

  let totalCreated = 0;
  let totalUpdated = 0;
  let totalSkipped = 0;

  for (const file of files) {
    const citySlug = file.replace(".json", "");
    const dbCity = await prisma.city.findUnique({
      where: { slug: citySlug },
      include: { country: true },
    });
    if (!dbCity) {
      console.warn(`Skipping ${citySlug}: city not found in DB`);
      continue;
    }

    const places: FetchedPlace[] = JSON.parse(
      fs.readFileSync(path.join(DATA_DIR, file), "utf8"),
    );

    let created = 0;
    let updated = 0;
    let skipped = 0;

    for (const p of places) {
      if (!p.slug) {
        skipped++;
        continue;
      }
      const priceAmount = estimatePriceUsd(p.category, p.priceLevel, dbCity.country.slug);
      const bestSeason = inferBestSeason(p.category, p.name, p.description, dbCity.country.slug);

      const existing = await prisma.place.findUnique({ where: { slug: p.slug } });
      const data = {
        name: p.name,
        cityId: dbCity.id,
        category: p.category,
        description: p.description,
        address: p.address,
        latitude: p.latitude,
        longitude: p.longitude,
        priceLevel: p.priceLevel,
        priceAmount,
        bestSeason,
        avgRating: p.avgRating,
        reviewCount: p.reviewCount,
        openingHours: p.openingHours ?? undefined,
        website: p.website,
        phone: p.phone,
      };

      const dbPlace = await prisma.place.upsert({
        where: { slug: p.slug },
        update: data,
        create: { ...data, slug: p.slug },
      });
      if (existing) updated++;
      else created++;

      const photoUrls =
        p.photoUrls.length > 0
          ? p.photoUrls
          : [`https://picsum.photos/seed/${p.slug}-1/800/600`];
      for (const [i, photoUrl] of photoUrls.entries()) {
        await prisma.photo.upsert({
          where: { id: `${dbPlace.id}-${photoUrl}` },
          update: { url: photoUrl, caption: p.name, isCover: i === 0 },
          create: {
            id: `${dbPlace.id}-${photoUrl}`,
            placeId: dbPlace.id,
            url: photoUrl,
            caption: p.name,
            isCover: i === 0,
          },
        });
      }
    }

    console.log(
      `[${citySlug}] created ${created}, updated ${updated}, skipped ${skipped} (of ${places.length})`,
    );
    totalCreated += created;
    totalUpdated += updated;
    totalSkipped += skipped;
  }

  console.log(
    `Done. Total created: ${totalCreated}, updated: ${totalUpdated}, skipped: ${totalSkipped}`,
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

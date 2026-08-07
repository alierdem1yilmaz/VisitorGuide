import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const DATA_PATH = path.join(__dirname, "..", "prisma", "curatedPlaceRatings.json");

async function main() {
  const ratingBySlug: Record<string, { avgRating: number; reviewCount: number }> =
    JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));

  let updated = 0;
  let skipped = 0;

  for (const [slug, { avgRating, reviewCount }] of Object.entries(ratingBySlug)) {
    try {
      await prisma.place.update({
        where: { slug },
        data: { avgRating, reviewCount },
      });
      updated++;
    } catch {
      console.log(`SKIP (place not found): ${slug}`);
      skipped++;
    }
  }

  console.log(`Done. Updated: ${updated}, skipped: ${skipped}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

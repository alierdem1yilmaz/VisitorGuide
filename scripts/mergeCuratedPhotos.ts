import fs from "fs";
import path from "path";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();
const DATA_PATH = path.join(__dirname, "..", "prisma", "curatedPlacePhotos.json");

async function main() {
  const photoBySlug: Record<string, string> = JSON.parse(
    fs.readFileSync(DATA_PATH, "utf8"),
  );

  let updated = 0;
  let skipped = 0;

  for (const [slug, photoUrl] of Object.entries(photoBySlug)) {
    const place = await prisma.place.findUnique({
      where: { slug },
      include: { photos: { where: { isCover: true } } },
    });
    if (!place) {
      console.log(`SKIP (place not found): ${slug}`);
      skipped++;
      continue;
    }
    const cover = place.photos[0];
    if (!cover) {
      console.log(`SKIP (no cover photo row): ${slug}`);
      skipped++;
      continue;
    }
    await prisma.photo.update({
      where: { id: cover.id },
      data: { url: photoUrl },
    });
    updated++;
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

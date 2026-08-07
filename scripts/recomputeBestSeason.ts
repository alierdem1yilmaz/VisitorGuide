import { PrismaClient, Season } from "@prisma/client";
import { inferBestSeason } from "../prisma/seasonEstimate";

const prisma = new PrismaClient();

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

async function main() {
  const places = await withRetry(() =>
    prisma.place.findMany({
      where: { bestSeason: Season.ALL },
      select: {
        id: true,
        category: true,
        name: true,
        description: true,
        city: { select: { country: { select: { slug: true } } } },
      },
    }),
  );

  console.log(`Checking ${places.length} places currently set to ALL.`);

  let updated = 0;
  const bySeason: Record<string, number> = { SUMMER: 0, WINTER: 0 };

  for (const place of places) {
    const inferred = inferBestSeason(
      place.category,
      place.name,
      place.description,
      place.city.country.slug,
    );
    if (inferred === Season.ALL) continue;

    await withRetry(() =>
      prisma.place.update({
        where: { id: place.id },
        data: { bestSeason: inferred },
      }),
    );
    updated++;
    bySeason[inferred] = (bySeason[inferred] ?? 0) + 1;
  }

  console.log(`Done. Updated: ${updated} (SUMMER: ${bySeason.SUMMER}, WINTER: ${bySeason.WINTER}).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

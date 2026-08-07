import { PrismaClient } from "@prisma/client";
import { estimatePriceUsd } from "../prisma/priceEstimate";

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
      select: {
        id: true,
        category: true,
        priceLevel: true,
        priceAmount: true,
        city: { select: { country: { select: { slug: true } } } },
      },
    }),
  );

  let updated = 0;
  for (const place of places) {
    const newAmount = estimatePriceUsd(place.category, place.priceLevel, place.city.country.slug);
    if (newAmount !== place.priceAmount) {
      await withRetry(() =>
        prisma.place.update({
          where: { id: place.id },
          data: { priceAmount: newAmount },
        }),
      );
      updated++;
    }
  }

  console.log(`Done. Places checked: ${places.length}, updated: ${updated}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

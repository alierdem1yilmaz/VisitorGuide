import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { routing } from "@/i18n/routing";
import { PLACE_CHUNK_SIZE } from "@/lib/sitemapConfig";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Each sitemap entry embeds one hreflang alternate per locale (50), so a
// single file covering all ~5500 country/city/place URLs would balloon to
// tens of MB and blow past Vercel's per-page ISR size limit ("Oversized
// Incremental Static Regeneration (ISR) page"). Chunk 0 covers the home
// page + all countries + all cities (small, ~180 entries); every
// subsequent chunk covers a page of PLACE_CHUNK_SIZE places. The index
// listing all chunks lives at /sitemap-index.xml (see that route) since
// Next.js's generateSitemaps() doesn't auto-create one.

function alternates(path: string) {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] =
      locale === routing.defaultLocale
        ? `${siteUrl}${path}`
        : `${siteUrl}/${locale}${path}`;
  }
  return languages;
}

export async function generateSitemaps() {
  const totalPlaces = await prisma.place.count();
  const placeChunks = Math.ceil(totalPlaces / PLACE_CHUNK_SIZE);
  return Array.from({ length: placeChunks + 1 }, (_, id) => ({ id }));
}

export default async function sitemap({
  id,
}: {
  id: number;
}): Promise<MetadataRoute.Sitemap> {
  const chunkId = Number(id);

  if (chunkId === 0) {
    const [countries, cities] = await Promise.all([
      prisma.country.findMany({ select: { slug: true, updatedAt: true } }),
      prisma.city.findMany({
        select: {
          slug: true,
          updatedAt: true,
          country: { select: { slug: true } },
        },
      }),
    ]);

    const entries: MetadataRoute.Sitemap = [
      {
        url: siteUrl,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
        alternates: { languages: alternates("") },
      },
    ];

    for (const country of countries) {
      const path = `/countries/${country.slug}`;
      entries.push({
        url: `${siteUrl}${path}`,
        lastModified: country.updatedAt,
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: { languages: alternates(path) },
      });
    }

    for (const city of cities) {
      const path = `/countries/${city.country.slug}/${city.slug}`;
      entries.push({
        url: `${siteUrl}${path}`,
        lastModified: city.updatedAt,
        changeFrequency: "weekly",
        priority: 0.7,
        alternates: { languages: alternates(path) },
      });
    }

    return entries;
  }

  const places = await prisma.place.findMany({
    select: {
      slug: true,
      updatedAt: true,
      city: { select: { slug: true, country: { select: { slug: true } } } },
    },
    orderBy: { id: "asc" },
    skip: (chunkId - 1) * PLACE_CHUNK_SIZE,
    take: PLACE_CHUNK_SIZE,
  });

  return places.map((place) => {
    const path = `/countries/${place.city.country.slug}/${place.city.slug}/${place.slug}`;
    return {
      url: `${siteUrl}${path}`,
      lastModified: place.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
      alternates: { languages: alternates(path) },
    };
  });
}

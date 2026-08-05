import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { routing } from "@/i18n/routing";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [countries, cities, places] = await Promise.all([
    prisma.country.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.city.findMany({
      select: {
        slug: true,
        updatedAt: true,
        country: { select: { slug: true } },
      },
    }),
    prisma.place.findMany({
      select: {
        slug: true,
        updatedAt: true,
        city: { select: { slug: true, country: { select: { slug: true } } } },
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

  for (const place of places) {
    const path = `/countries/${place.city.country.slug}/${place.city.slug}/${place.slug}`;
    entries.push({
      url: `${siteUrl}${path}`,
      lastModified: place.updatedAt,
      changeFrequency: "weekly",
      priority: 0.6,
      alternates: { languages: alternates(path) },
    });
  }

  return entries;
}

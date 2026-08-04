import { Category } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export function getAllCountries() {
  return prisma.country.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { cities: true } } },
  });
}

export function getCountryBySlug(slug: string) {
  return prisma.country.findUnique({
    where: { slug },
    include: {
      cities: {
        orderBy: { name: "asc" },
        include: { _count: { select: { places: true } } },
      },
      _count: { select: { cities: true } },
    },
  });
}

export async function getCityBySlug(
  countrySlug: string,
  citySlug: string,
  category?: Category,
) {
  const city = await prisma.city.findUnique({
    where: { slug: citySlug },
    include: {
      country: true,
      places: {
        where: category ? { category } : undefined,
        orderBy: { name: "asc" },
        include: { photos: { where: { isCover: true }, take: 1 } },
      },
    },
  });

  if (!city || city.country.slug !== countrySlug) return null;
  return city;
}

export async function getPlaceBySlug(
  countrySlug: string,
  citySlug: string,
  placeSlug: string,
) {
  const place = await prisma.place.findUnique({
    where: { slug: placeSlug },
    include: {
      city: { include: { country: true } },
      photos: { orderBy: { isCover: "desc" } },
      reviews: {
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true } } },
      },
    },
  });

  if (!place || place.city.slug !== citySlug || place.city.country.slug !== countrySlug) {
    return null;
  }
  return place;
}

export function getCountryPlacesForMap(countrySlug: string) {
  return prisma.place.findMany({
    where: { city: { country: { slug: countrySlug } } },
    select: {
      id: true,
      slug: true,
      name: true,
      category: true,
      latitude: true,
      longitude: true,
      city: { select: { slug: true } },
    },
  });
}

export async function searchAll({
  q,
  category,
}: {
  q?: string;
  category?: Category;
}) {
  const nameFilter = q ? { contains: q, mode: "insensitive" as const } : undefined;

  const [countries, cities, places] = await Promise.all([
    category
      ? Promise.resolve([])
      : prisma.country.findMany({
          where: { name: nameFilter },
          include: { _count: { select: { cities: true } } },
          take: 10,
        }),
    category
      ? Promise.resolve([])
      : prisma.city.findMany({
          where: { name: nameFilter },
          include: { country: true, _count: { select: { places: true } } },
          take: 10,
        }),
    prisma.place.findMany({
      where: {
        name: nameFilter,
        category,
      },
      include: {
        city: { include: { country: true } },
        photos: { where: { isCover: true }, take: 1 },
      },
      take: 24,
    }),
  ]);

  return { countries, cities, places };
}

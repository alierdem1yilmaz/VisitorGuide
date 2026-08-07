import { Category, Season } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { haversineKm } from "@/lib/distance";

export type PlaceSort = "name" | "rating" | "priceAsc" | "priceDesc" | "distance";

export type PlaceFilters = {
  category?: Category;
  minRating?: number;
  maxPrice?: number;
  season?: Season;
  sort?: PlaceSort;
  q?: string;
};

function placeWhere(filters: Omit<PlaceFilters, "sort">) {
  return {
    category: filters.category,
    avgRating: filters.minRating ? { gte: filters.minRating } : undefined,
    priceLevel: filters.maxPrice ? { lte: filters.maxPrice } : undefined,
    bestSeason: filters.season
      ? { in: [filters.season, "ALL" as const] }
      : undefined,
    OR: filters.q
      ? [
          { name: { contains: filters.q, mode: "insensitive" as const } },
          { address: { contains: filters.q, mode: "insensitive" as const } },
        ]
      : undefined,
  };
}

function placeOrderBy(sort?: PlaceSort) {
  switch (sort) {
    case "rating":
      return { avgRating: "desc" as const };
    case "priceAsc":
      return { priceLevel: "asc" as const };
    case "priceDesc":
      return { priceLevel: "desc" as const };
    case "name":
      return { name: "asc" as const };
    default:
      return { avgRating: "desc" as const };
  }
}

function sortByDistance<T extends { latitude: number | null; longitude: number | null }>(
  places: T[],
  from: { latitude: number | null; longitude: number | null },
) {
  if (from.latitude == null || from.longitude == null) return places;
  const originLat = from.latitude;
  const originLng = from.longitude;

  return [...places].sort((a, b) => {
    if (a.latitude == null || a.longitude == null) return 1;
    if (b.latitude == null || b.longitude == null) return -1;
    return (
      haversineKm(originLat, originLng, a.latitude, a.longitude) -
      haversineKm(originLat, originLng, b.latitude, b.longitude)
    );
  });
}

export function getPlaceCount() {
  return prisma.place.count();
}

export function getAllCountries() {
  return prisma.country.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { cities: true } } },
  });
}

export async function getFeaturedPlacesByCategory(perCategory = 8) {
  const categories = Object.values(Category);
  const results = await Promise.all(
    categories.map((category) =>
      prisma.place.findMany({
        where: { category, photos: { some: { isCover: true } } },
        orderBy: { reviewCount: "desc" },
        take: perCategory,
        include: {
          photos: { where: { isCover: true }, take: 1 },
          city: { include: { country: true } },
        },
      }),
    ),
  );

  return Object.fromEntries(categories.map((c, i) => [c, results[i]])) as Record<
    Category,
    (typeof results)[number]
  >;
}

const TOP_PLACE_PHOTOS_INCLUDE = {
  where: { photos: { some: { isCover: true } } },
  orderBy: { reviewCount: "desc" as const },
  take: 5,
  select: { photos: { where: { isCover: true }, take: 1, select: { url: true } } },
};

function extractPhotoUrls(places: { photos: { url: string }[] }[]) {
  return places
    .flatMap((p) => p.photos.map((photo) => photo.url))
    .filter((url) => !url.includes("picsum"));
}

export function getCountryBySlug(slug: string) {
  return prisma.country.findUnique({
    where: { slug },
    include: {
      cities: {
        orderBy: { name: "asc" },
        include: {
          _count: { select: { places: true } },
          places: TOP_PLACE_PHOTOS_INCLUDE,
        },
      },
      _count: { select: { cities: true } },
    },
  });
}

async function topPlacePhotosForCountry(countrySlug: string) {
  const places = await prisma.place.findMany({
    where: { city: { country: { slug: countrySlug } }, photos: { some: { isCover: true } } },
    orderBy: { reviewCount: "desc" },
    take: 5,
    select: { photos: { where: { isCover: true }, take: 1, select: { url: true } } },
  });
  return extractPhotoUrls(places);
}

export async function getAllCountriesWithPhotos() {
  const countries = await prisma.country.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { cities: true } } },
  });
  return Promise.all(
    countries.map(async (country) => ({
      ...country,
      photoUrls: await topPlacePhotosForCountry(country.slug),
    })),
  );
}

export async function getCityBySlug(
  countrySlug: string,
  citySlug: string,
  filters: PlaceFilters = {},
) {
  const city = await prisma.city.findUnique({
    where: { slug: citySlug },
    include: {
      country: true,
      places: {
        where: placeWhere(filters),
        orderBy: placeOrderBy(filters.sort),
        include: { photos: { where: { isCover: true }, take: 1 } },
      },
    },
  });

  if (!city || city.country.slug !== countrySlug) return null;

  if (filters.sort === "distance") {
    return { ...city, places: sortByDistance(city.places, city) };
  }
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

export function getUserReviews(userId: string) {
  return prisma.review.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      place: {
        select: {
          name: true,
          slug: true,
          city: { select: { slug: true, country: { select: { slug: true } } } },
        },
      },
    },
  });
}

export function getUserFavorites(userId: string) {
  return prisma.favorite.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      place: {
        select: {
          name: true,
          slug: true,
          avgRating: true,
          reviewCount: true,
          city: { select: { slug: true, country: { select: { slug: true } } } },
          photos: { where: { isCover: true }, take: 1 },
        },
      },
    },
  });
}

export async function getFavoritePlaceIds(userId: string | undefined, placeIds: string[]) {
  if (!userId || placeIds.length === 0) return new Set<string>();
  const favorites = await prisma.favorite.findMany({
    where: { userId, placeId: { in: placeIds } },
    select: { placeId: true },
  });
  return new Set(favorites.map((f) => f.placeId));
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
  minRating,
  maxPrice,
  season,
  sort,
}: {
  q?: string;
} & PlaceFilters) {
  const nameFilter = q ? { contains: q, mode: "insensitive" as const } : undefined;

  const [countriesRaw, cities, places] = await Promise.all([
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
          include: {
            country: true,
            _count: { select: { places: true } },
            places: TOP_PLACE_PHOTOS_INCLUDE,
          },
          take: 10,
        }),
    prisma.place.findMany({
      where: { name: nameFilter, ...placeWhere({ category, minRating, maxPrice, season }) },
      orderBy: sort === "distance" ? undefined : placeOrderBy(sort),
      include: {
        city: { include: { country: true } },
        photos: { where: { isCover: true }, take: 1 },
      },
      take: 24,
    }),
  ]);

  const sortedPlaces =
    sort === "distance"
      ? [...places].sort(
          (a, b) => distanceFromOwnCity(a) - distanceFromOwnCity(b),
        )
      : places;

  const countries = await Promise.all(
    countriesRaw.map(async (country) => ({
      ...country,
      photoUrls: await topPlacePhotosForCountry(country.slug),
    })),
  );

  return { countries, cities, places: sortedPlaces };
}

function distanceFromOwnCity(place: {
  latitude: number | null;
  longitude: number | null;
  city: { latitude: number | null; longitude: number | null };
}) {
  const { latitude, longitude, city } = place;
  if (
    latitude == null ||
    longitude == null ||
    city.latitude == null ||
    city.longitude == null
  ) {
    return Infinity;
  }
  return haversineKm(city.latitude, city.longitude, latitude, longitude);
}

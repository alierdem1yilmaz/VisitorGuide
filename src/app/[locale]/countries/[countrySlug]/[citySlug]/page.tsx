import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Breadcrumbs from "@/components/breadcrumbs/Breadcrumbs";
import PlaceCard from "@/components/place/PlaceCard";
import MapView from "@/components/place/MapView";
import ViewToggle from "@/components/place/ViewToggle";
import FilterBar from "@/components/place/FilterBar";
import SeasonToggle from "@/components/place/SeasonToggle";
import PhotoCarousel from "@/components/place/PhotoCarousel";
import HighlightRow from "@/components/place/HighlightRow";
import { getCityBySlug, getFavoritePlaceIds, type PlaceSort } from "@/lib/queries";
import { Category, Season } from "@/generated/prisma/client";
import { auth } from "@/auth";
import { getExchangeRates, getPreferredCurrency, formatConvertedPrice } from "@/lib/currency";

export const revalidate = 60;

const CATEGORIES = Object.values(Category);
const SORTS: PlaceSort[] = ["name", "rating", "priceAsc", "priceDesc", "distance"];

function isCategory(value: string | undefined): value is Category {
  return !!value && (CATEGORIES as string[]).includes(value);
}

function isSort(value: string | undefined): value is PlaceSort {
  return !!value && (SORTS as string[]).includes(value);
}

function isSeason(value: string | undefined): value is Season {
  return value === "SUMMER" || value === "WINTER";
}

type PageParams = { locale: string; countrySlug: string; citySlug: string };
type PageSearchParams = {
  category?: string;
  view?: string;
  sort?: string;
  minRating?: string;
  maxPrice?: string;
  season?: string;
  q?: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { countrySlug, citySlug } = await params;
  const city = await getCityBySlug(countrySlug, citySlug);
  if (!city) return {};

  return {
    title: `${city.name} — VisitorGuide`,
    description: city.description ?? undefined,
  };
}

export default async function CityPage({
  params,
  searchParams,
}: {
  params: Promise<PageParams>;
  searchParams: Promise<PageSearchParams>;
}) {
  const { locale, countrySlug, citySlug } = await params;
  const {
    category: rawCategory,
    view: rawView,
    sort: rawSort,
    minRating: rawMinRating,
    maxPrice: rawMaxPrice,
    season: rawSeason,
    q,
  } = await searchParams;
  setRequestLocale(locale);

  const category = isCategory(rawCategory) ? rawCategory : undefined;
  const view = rawView === "map" ? "map" : "grid";
  const sort = isSort(rawSort) ? rawSort : undefined;
  const minRating = rawMinRating ? Number(rawMinRating) : undefined;
  const maxPrice = rawMaxPrice ? Number(rawMaxPrice) : undefined;
  const season = isSeason(rawSeason) ? rawSeason : undefined;

  const city = await getCityBySlug(countrySlug, citySlug, {
    category,
    sort,
    minRating,
    maxPrice,
    season,
    q,
  });
  if (!city) notFound();

  const [t, tCategories, tFilters, tPlace, session] = await Promise.all([
    getTranslations("common"),
    getTranslations("categories"),
    getTranslations("filters"),
    getTranslations("place"),
    auth(),
  ]);
  const favoriteIds = await getFavoritePlaceIds(
    session?.user?.id,
    city.places.map((p) => p.id),
  );
  const [preferredCurrency, rates] = await Promise.all([
    getPreferredCurrency(city.country.currencyCode ?? "USD"),
    getExchangeRates(),
  ]);

  const basePath = `/countries/${countrySlug}/${citySlug}`;

  const showCategorySpotlight = Boolean(category) && category !== Category.HOTEL;
  const showBaseHero = !category;

  const heroPhotos =
    showCategorySpotlight || showBaseHero
      ? [...city.places]
          .sort((a, b) => b.reviewCount - a.reviewCount)
          .map((p) => p.photos[0]?.url)
          .filter((url): url is string => !!url && !url.includes("picsum"))
          .slice(0, 6)
          .map((url) => ({ url, alt: city.name }))
      : [];

  function toHighlight(place: NonNullable<typeof city>["places"][number]) {
    return {
      id: place.id,
      href: `${basePath}/${place.slug}`,
      name: place.name,
      coverImageUrl: place.photos[0]?.url ?? null,
      avgRating: place.avgRating,
      reviewCount: place.reviewCount,
    };
  }

  const mostPopular = showCategorySpotlight
    ? [...city.places].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 8).map(toHighlight)
    : [];
  const topRated = showCategorySpotlight
    ? [...city.places]
        .filter((p) => p.avgRating > 0)
        .sort((a, b) => b.avgRating - a.avgRating)
        .slice(0, 8)
        .map(toHighlight)
    : [];

  function buildQuery(overrides: { category?: string }) {
    const params = new URLSearchParams();
    const nextCategory = "category" in overrides ? overrides.category : category;
    if (nextCategory) params.set("category", nextCategory);
    if (view === "map") params.set("view", "map");
    if (sort && sort !== "name") params.set("sort", sort);
    if (minRating) params.set("minRating", String(minRating));
    if (maxPrice) params.set("maxPrice", String(maxPrice));
    if (season) params.set("season", season);
    if (q) params.set("q", q);
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      {showCategorySpotlight ? (
        <>
          <Breadcrumbs
            items={[
              { label: city.country.name, href: `/countries/${countrySlug}` },
              { label: city.name, href: basePath },
              { label: tCategories(category!) },
            ]}
          />
          <div className="mt-3">
            <h1 className="text-3xl font-bold text-brand-800">
              {tCategories(category!)}
            </h1>
            <p className="mt-1 text-muted">
              {city.name}, {city.country.name}
            </p>
          </div>
          <div className="mt-6">
            <PhotoCarousel
              photos={heroPhotos}
              previousLabel={tFilters("previousPhoto")}
              nextLabel={tFilters("nextPhoto")}
              variant="hero"
              priority
            />
          </div>
          <div className="mt-8">
            <HighlightRow label={tFilters("mostPopular")} places={mostPopular} />
            <HighlightRow label={tFilters("topRated")} places={topRated} />
          </div>
          <h2 className="mb-2 mt-2 text-lg font-bold text-brand-800">
            {tFilters("allInCategory")}
          </h2>
        </>
      ) : showBaseHero ? (
        <>
          <h1 className="text-3xl font-bold text-brand-800">{city.name}</h1>
          {city.description && (
            <p className="mt-3 max-w-2xl text-muted">{city.description}</p>
          )}
          <div className="mt-6">
            <PhotoCarousel
              photos={heroPhotos}
              previousLabel={tFilters("previousPhoto")}
              nextLabel={tFilters("nextPhoto")}
              variant="hero"
              priority
            />
          </div>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-brand-800">{city.name}</h1>
          {city.description && (
            <p className="mt-3 max-w-2xl text-muted">{city.description}</p>
          )}
        </>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <Link
            href={buildQuery({ category: undefined })}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              !category
                ? "bg-brand-600 text-white"
                : "border border-brand-100 bg-white text-brand-700 hover:bg-brand-50"
            }`}
          >
            {t("all")}
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              href={buildQuery({ category: c })}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                category === c
                  ? "bg-brand-600 text-white"
                  : "border border-brand-100 bg-white text-brand-700 hover:bg-brand-50"
              }`}
            >
              {tCategories(c)}
            </Link>
          ))}
        </div>
        <ViewToggle
          basePath={basePath}
          category={category}
          view={view}
          gridLabel={t("gridView")}
          mapLabel={t("mapView")}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <FilterBar
          sortLabel={tFilters("sortLabel")}
          ratingLabel={tFilters("ratingLabel")}
          priceLabel={tFilters("priceLabel")}
          searchPlaceholder={tFilters("searchPlaceholder")}
          sortOptions={{
            rating: tFilters("sortRating"),
            priceAsc: tFilters("sortPriceAsc"),
            priceDesc: tFilters("sortPriceDesc"),
            distance: tFilters("sortDistance"),
          }}
          ratingAnyLabel={tFilters("ratingAny")}
          priceAnyLabel={tFilters("priceAny")}
        />
        <SeasonToggle
          allLabel={tFilters("seasonAll")}
          summerLabel={tFilters("seasonSummer")}
          winterLabel={tFilters("seasonWinter")}
        />
      </div>

      {view === "map" ? (
        <div className="mt-8">
          <MapView
            pins={city.places.map((place) => ({
              id: place.id,
              name: place.name,
              latitude: place.latitude,
              longitude: place.longitude,
              href: `${basePath}/${place.slug}`,
            }))}
            fallbackCenter={{
              lat: city.latitude ?? 0,
              lng: city.longitude ?? 0,
            }}
          />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {city.places.map((place) => (
            <PlaceCard
              key={place.id}
              href={`${basePath}/${place.slug}`}
              name={place.name}
              description={place.description}
              coverImageUrl={place.photos[0]?.url ?? null}
              avgRating={place.avgRating}
              reviewCount={place.reviewCount}
              priceLevel={place.priceLevel}
              categoryLabel={tCategories(place.category)}
              estimatedPrice={
                place.priceAmount != null
                  ? formatConvertedPrice(place.priceAmount, preferredCurrency, rates, locale)
                  : undefined
              }
              priceEstimateLabel={tPlace("priceEstimateNote")}
              favorite={{
                placeId: place.id,
                path: buildQuery({}),
                isFavorited: favoriteIds.has(place.id),
                addLabel: tPlace("addToFavorites"),
                removeLabel: tPlace("removeFromFavorites"),
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

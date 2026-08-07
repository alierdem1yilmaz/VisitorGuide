import { getTranslations, setRequestLocale } from "next-intl/server";
import CountryCard from "@/components/destination/CountryCard";
import CityCard from "@/components/destination/CityCard";
import PlaceCard from "@/components/place/PlaceCard";
import FilterBar from "@/components/place/FilterBar";
import SeasonToggle from "@/components/place/SeasonToggle";
import {
  searchAll,
  getFavoritePlaceIds,
  getAllCountriesWithPhotos,
  type PlaceSort,
} from "@/lib/queries";
import { Category, Season } from "@/generated/prisma/client";
import { auth } from "@/auth";
import { getExchangeRates, getPreferredCurrency, formatConvertedPrice } from "@/lib/currency";

const SORTS: PlaceSort[] = ["name", "rating", "priceAsc", "priceDesc", "distance"];

function isCategory(value: string | undefined): value is Category {
  return !!value && (Object.values(Category) as string[]).includes(value);
}

function isSort(value: string | undefined): value is PlaceSort {
  return !!value && (SORTS as string[]).includes(value);
}

function isSeason(value: string | undefined): value is Season {
  return value === "SUMMER" || value === "WINTER";
}

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    q?: string;
    category?: string;
    sort?: string;
    minRating?: string;
    maxPrice?: string;
    season?: string;
  }>;
}) {
  const { locale } = await params;
  const {
    q,
    category: rawCategory,
    sort: rawSort,
    minRating: rawMinRating,
    maxPrice: rawMaxPrice,
    season: rawSeason,
  } = await searchParams;
  setRequestLocale(locale);

  const category = isCategory(rawCategory) ? rawCategory : undefined;
  const sort = isSort(rawSort) ? rawSort : undefined;
  const minRating = rawMinRating ? Number(rawMinRating) : undefined;
  const maxPrice = rawMaxPrice ? Number(rawMaxPrice) : undefined;
  const season = isSeason(rawSeason) ? rawSeason : undefined;
  const hasSearchContext = Boolean(q || category);

  const [t, tCommon, tCategories, tFilters, tPlace, session] = await Promise.all([
    getTranslations("search"),
    getTranslations("common"),
    getTranslations("categories"),
    getTranslations("filters"),
    getTranslations("place"),
    auth(),
  ]);

  if (!hasSearchContext) {
    const exploreCountries = await getAllCountriesWithPhotos();
    return (
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-3xl font-bold text-brand-800">{t("exploreHeading")}</h1>
        <p className="mt-3 max-w-2xl text-muted">{t("exploreSubtitle")}</p>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {exploreCountries.map((country) => (
            <CountryCard
              key={country.id}
              href={`/countries/${country.slug}`}
              name={country.name}
              description={country.description}
              photos={country.photoUrls.map((url) => ({ url, alt: country.name }))}
              cityCountLabel={tCommon("cityCount", { count: country._count.cities })}
              previousLabel={tFilters("previousPhoto")}
              nextLabel={tFilters("nextPhoto")}
            />
          ))}
        </div>
      </div>
    );
  }

  const { countries, cities, places } = await searchAll({
    q,
    category,
    sort,
    minRating,
    maxPrice,
    season,
  });

  const favoriteIds = await getFavoritePlaceIds(
    session?.user?.id,
    places.map((p) => p.id),
  );
  const [preferredCurrency, rates] = await Promise.all([
    getPreferredCurrency("USD"),
    getExchangeRates(),
  ]);

  const currentPath = (() => {
    const qp = new URLSearchParams();
    if (q) qp.set("q", q);
    if (category) qp.set("category", category);
    if (sort) qp.set("sort", sort);
    if (minRating) qp.set("minRating", String(minRating));
    if (maxPrice) qp.set("maxPrice", String(maxPrice));
    if (season) qp.set("season", season);
    const qs = qp.toString();
    return qs ? `/search?${qs}` : "/search";
  })();

  const hasResults = countries.length > 0 || cities.length > 0 || places.length > 0;
  const heading = category ? tCategories(category) : t("resultsFor", { query: q ?? "" });

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-2xl font-bold text-brand-800">{heading}</h1>

      {!hasResults && <p className="mt-6 text-muted">{t("noResults")}</p>}

      {countries.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-4 text-lg font-semibold text-brand-700">
            {t("countries")}
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {countries.map((country) => (
              <CountryCard
                key={country.id}
                href={`/countries/${country.slug}`}
                name={country.name}
                description={country.description}
                photos={country.photoUrls.map((url) => ({ url, alt: country.name }))}
                cityCountLabel={tCommon("cityCount", { count: country._count.cities })}
                previousLabel={tFilters("previousPhoto")}
                nextLabel={tFilters("nextPhoto")}
              />
            ))}
          </div>
        </section>
      )}

      {cities.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-4 text-lg font-semibold text-brand-700">{t("cities")}</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {cities.map((city) => (
              <CityCard
                key={city.id}
                href={`/countries/${city.country.slug}/${city.slug}`}
                name={city.name}
                description={city.description}
                photos={city.places
                  .flatMap((p) => p.photos.map((photo) => photo.url))
                  .filter((url) => !url.includes("picsum"))
                  .map((url) => ({ url, alt: city.name }))}
                placeCountLabel={tCommon("placeCount", { count: city._count.places })}
                previousLabel={tFilters("previousPhoto")}
                nextLabel={tFilters("nextPhoto")}
              />
            ))}
          </div>
        </section>
      )}

      {hasSearchContext && (
        <section className="mt-8">
          <h2 className="mb-4 text-lg font-semibold text-brand-700">{t("places")}</h2>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
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
          {places.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {places.map((place) => (
                <PlaceCard
                  key={place.id}
                  href={`/countries/${place.city.country.slug}/${place.city.slug}/${place.slug}`}
                  name={place.name}
                  description={place.description}
                  coverImageUrl={place.photos[0]?.url ?? null}
                  avgRating={place.avgRating}
                  reviewCount={place.reviewCount}
                  priceLevel={place.priceLevel}
                  categoryLabel={tCategories(place.category)}
                  season={place.bestSeason !== "ALL" ? place.bestSeason : undefined}
                  seasonLabel={
                    place.bestSeason === "SUMMER"
                      ? tFilters("seasonSummer")
                      : place.bestSeason === "WINTER"
                        ? tFilters("seasonWinter")
                        : undefined
                  }
                  estimatedPrice={
                    place.priceAmount != null
                      ? formatConvertedPrice(place.priceAmount, preferredCurrency, rates, locale)
                      : undefined
                  }
                  priceEstimateLabel={tPlace("priceEstimateNote")}
                  priceCategoryLabel={tPlace(`priceLabelByCategory.${place.category}`)}
                  favorite={{
                    placeId: place.id,
                    path: currentPath,
                    isFavorited: favoriteIds.has(place.id),
                    addLabel: tPlace("addToFavorites"),
                    removeLabel: tPlace("removeFromFavorites"),
                  }}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted">{t("noResults")}</p>
          )}
        </section>
      )}
    </div>
  );
}

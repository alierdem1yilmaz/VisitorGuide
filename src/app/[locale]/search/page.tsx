import { getTranslations, setRequestLocale } from "next-intl/server";
import CountryCard from "@/components/destination/CountryCard";
import CityCard from "@/components/destination/CityCard";
import PlaceCard from "@/components/place/PlaceCard";
import { searchAll } from "@/lib/queries";
import { Category } from "@/generated/prisma/client";

function isCategory(value: string | undefined): value is Category {
  return !!value && (Object.values(Category) as string[]).includes(value);
}

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { locale } = await params;
  const { q, category: rawCategory } = await searchParams;
  setRequestLocale(locale);

  const category = isCategory(rawCategory) ? rawCategory : undefined;
  const { countries, cities, places } = await searchAll({ q, category });

  const [t, tCommon, tCategories] = await Promise.all([
    getTranslations("search"),
    getTranslations("common"),
    getTranslations("categories"),
  ]);

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
                coverImageUrl={country.coverImageUrl}
                cityCountLabel={tCommon("cityCount", { count: country._count.cities })}
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
                coverImageUrl={city.coverImageUrl}
                placeCountLabel={tCommon("placeCount", { count: city._count.places })}
              />
            ))}
          </div>
        </section>
      )}

      {places.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-4 text-lg font-semibold text-brand-700">{t("places")}</h2>
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
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

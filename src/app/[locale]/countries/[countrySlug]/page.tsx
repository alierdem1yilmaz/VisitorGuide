import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import CityCard from "@/components/destination/CityCard";
import MapView from "@/components/place/MapView";
import ViewToggle from "@/components/place/ViewToggle";
import { getCountryBySlug, getCountryPlacesForMap } from "@/lib/queries";

export const revalidate = 60;

export default async function CountryPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; countrySlug: string }>;
  searchParams: Promise<{ view?: string }>;
}) {
  const { locale, countrySlug } = await params;
  const { view: rawView } = await searchParams;
  setRequestLocale(locale);

  const view = rawView === "map" ? "map" : "grid";

  const country = await getCountryBySlug(countrySlug);
  if (!country) notFound();

  const tCommon = await getTranslations("common");
  const placeCount = country.cities.reduce((sum, c) => sum + c._count.places, 0);

  const basePath = `/countries/${countrySlug}`;

  const citiesWithCoords = country.cities.filter(
    (c): c is typeof c & { latitude: number; longitude: number } =>
      c.latitude != null && c.longitude != null,
  );
  const fallbackCenter =
    citiesWithCoords.length > 0
      ? {
          lat:
            citiesWithCoords.reduce((sum, c) => sum + c.latitude, 0) /
            citiesWithCoords.length,
          lng:
            citiesWithCoords.reduce((sum, c) => sum + c.longitude, 0) /
            citiesWithCoords.length,
        }
      : { lat: 0, lng: 0 };

  const places = view === "map" ? await getCountryPlacesForMap(countrySlug) : [];

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold text-brand-800">{country.name}</h1>
      {country.description && (
        <p className="mt-3 max-w-2xl text-muted">{country.description}</p>
      )}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm font-medium text-brand-600">
          {tCommon("cityCount", { count: country._count.cities })} ·{" "}
          {tCommon("placeCount", { count: placeCount })}
          {country.currencyCode && (
            <>
              {" "}
              · {tCommon("currency")}: {country.currencyCode}
            </>
          )}
        </p>
        <ViewToggle
          basePath={basePath}
          view={view}
          gridLabel={tCommon("gridView")}
          mapLabel={tCommon("mapView")}
        />
      </div>

      {view === "map" ? (
        <div className="mt-8">
          <MapView
            pins={places.map((place) => ({
              id: place.id,
              name: place.name,
              latitude: place.latitude,
              longitude: place.longitude,
              href: `${basePath}/${place.city.slug}/${place.slug}`,
            }))}
            fallbackCenter={fallbackCenter}
          />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {country.cities.map((city) => (
            <CityCard
              key={city.id}
              href={`/countries/${country.slug}/${city.slug}`}
              name={city.name}
              description={city.description}
              coverImageUrl={city.coverImageUrl}
              placeCountLabel={tCommon("placeCount", { count: city._count.places })}
            />
          ))}
        </div>
      )}
    </div>
  );
}

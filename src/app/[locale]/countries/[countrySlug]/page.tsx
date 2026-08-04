import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import CityCard from "@/components/destination/CityCard";
import { getCountryBySlug } from "@/lib/queries";

export const revalidate = 60;

export default async function CountryPage({
  params,
}: {
  params: Promise<{ locale: string; countrySlug: string }>;
}) {
  const { locale, countrySlug } = await params;
  setRequestLocale(locale);

  const country = await getCountryBySlug(countrySlug);
  if (!country) notFound();

  const tCommon = await getTranslations("common");
  const placeCount = country.cities.reduce((sum, c) => sum + c._count.places, 0);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold text-brand-800">{country.name}</h1>
      {country.description && (
        <p className="mt-3 max-w-2xl text-muted">{country.description}</p>
      )}
      <p className="mt-4 text-sm font-medium text-brand-600">
        {tCommon("cityCount", { count: country._count.cities })} ·{" "}
        {tCommon("placeCount", { count: placeCount })}
      </p>

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
    </div>
  );
}

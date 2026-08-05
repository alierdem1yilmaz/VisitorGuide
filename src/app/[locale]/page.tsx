import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Hero from "@/components/home/Hero";
import CategoryShortcuts from "@/components/home/CategoryShortcuts";
import CountryCard from "@/components/destination/CountryCard";
import { getAllCountries } from "@/lib/queries";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });

  return {
    title: `VisitorGuide — ${t("title")}`,
    description: t("subtitle"),
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, tCommon, countries] = await Promise.all([
    getTranslations("home"),
    getTranslations("common"),
    getAllCountries(),
  ]);

  return (
    <div>
      <Hero title={t("title")} subtitle={t("subtitle")} />
      <CategoryShortcuts />
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <h2 className="mb-6 text-2xl font-bold text-brand-800">
          {t("allDestinations")}
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
    </div>
  );
}

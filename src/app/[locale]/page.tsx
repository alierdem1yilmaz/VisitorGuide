import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Hero from "@/components/home/Hero";
import CategoryShowcaseRow, {
  type ShowcasePlace,
} from "@/components/home/CategoryShowcaseRow";
import { getFeaturedPlacesByCategory } from "@/lib/queries";
import { Category } from "@/generated/prisma/client";

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

  const [t, tCategories, featured] = await Promise.all([
    getTranslations("home"),
    getTranslations("categories"),
    getFeaturedPlacesByCategory(),
  ]);

  const categories: Category[] = [
    Category.RESTAURANT,
    Category.ATTRACTION,
    Category.MONUMENT,
    Category.HOTEL,
    Category.NATURE,
  ];

  return (
    <div>
      <Hero title={t("title")} subtitle={t("subtitle")} />
      {categories.map((category) => {
        const places: ShowcasePlace[] = featured[category].map((place) => ({
          id: place.id,
          href: `/countries/${place.city.country.slug}/${place.city.slug}/${place.slug}`,
          name: place.name,
          photoUrl: place.photos[0]?.url ?? null,
          cityName: place.city.name,
          countryName: place.city.country.name,
        }));
        return (
          <CategoryShowcaseRow
            key={category}
            category={category}
            label={tCategories(category)}
            viewAllHref={`/search?category=${category}`}
            viewAllLabel={t("viewAll")}
            places={places}
          />
        );
      })}
    </div>
  );
}

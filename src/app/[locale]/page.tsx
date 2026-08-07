import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Hero from "@/components/home/Hero";
import IntroSection from "@/components/home/IntroSection";
import TrustStrip from "@/components/home/TrustStrip";
import CategoryShowcaseRow, {
  type ShowcasePlace,
} from "@/components/home/CategoryShowcaseRow";
import { getFeaturedPlacesByCategory, getPlaceCount } from "@/lib/queries";
import { Category } from "@prisma/client";
import introPhotos from "../../../prisma/introPhotos.json";

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

  const [t, tCommon, tCategories, featured, placeCount] = await Promise.all([
    getTranslations("home"),
    getTranslations("common"),
    getTranslations("categories"),
    getFeaturedPlacesByCategory(),
    getPlaceCount(),
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
      <IntroSection
        heading={t("introHeading")}
        subtitle={t("introSubtitle")}
        ctaLabel={t("introCta")}
        photos={introPhotos.map((p) => ({
          url: p.photoUrl,
          author: p.author,
          placeName: p.placeName,
        }))}
      />
      <TrustStrip
        heading={t("trustHeading")}
        caption={t("trustCaption", {
          placeCountLabel: tCommon("placeCount", { count: placeCount }),
        })}
        items={[
          { title: t("trustCuratedTitle"), description: t("trustCuratedDesc") },
          { title: t("trustNoFakeTitle"), description: t("trustNoFakeDesc") },
          { title: t("trustNoPaidTitle"), description: t("trustNoPaidDesc") },
        ]}
      />
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

import { getTranslations, setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");
  const countryCount = await prisma.country.count();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-4xl font-bold text-brand-800">{t("title")}</h1>
      <p className="mt-4 max-w-xl text-lg text-muted">{t("subtitle")}</p>
      <p className="mt-8 inline-block rounded-full bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700">
        {t("countriesInDb", { count: countryCount })}
      </p>
    </div>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Breadcrumbs from "@/components/breadcrumbs/Breadcrumbs";
import PhotoGallery from "@/components/place/PhotoGallery";
import PlaceMap from "@/components/place/PlaceMap";
import ReviewList from "@/components/place/ReviewList";
import WriteReviewCta from "@/components/place/WriteReviewCta";
import ReviewForm from "@/components/place/ReviewForm";
import StarRating from "@/components/place/StarRating";
import FavoriteButton from "@/components/place/FavoriteButton";
import { getPlaceBySlug, getFavoritePlaceIds } from "@/lib/queries";
import { auth } from "@/auth";
import { getExchangeRates, getPreferredCurrency, formatConvertedPrice } from "@/lib/currency";
import { CATEGORY_THEME } from "@/lib/categoryTheme";

export const revalidate = 60;

type PageParams = {
  locale: string;
  countrySlug: string;
  citySlug: string;
  placeSlug: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { countrySlug, citySlug, placeSlug } = await params;
  const place = await getPlaceBySlug(countrySlug, citySlug, placeSlug);
  if (!place) return {};

  return {
    title: `${place.name} — ${place.city.name}`,
    description: place.description ?? undefined,
  };
}

function isPlainObject(value: unknown): value is Record<string, string> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export default async function PlacePage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { locale, countrySlug, citySlug, placeSlug } = await params;
  setRequestLocale(locale);

  const place = await getPlaceBySlug(countrySlug, citySlug, placeSlug);
  if (!place) notFound();

  const [t, tCategories, tReview, tFilters, session] = await Promise.all([
    getTranslations("place"),
    getTranslations("categories"),
    getTranslations("review"),
    getTranslations("filters"),
    auth(),
  ]);

  const favoriteIds = await getFavoritePlaceIds(session?.user?.id, [place.id]);
  const openingHours = isPlainObject(place.openingHours) ? place.openingHours : null;
  const placePath = `/countries/${countrySlug}/${citySlug}/${placeSlug}`;
  const [preferredCurrency, rates] = await Promise.all([
    getPreferredCurrency(place.city.country.currencyCode ?? "USD"),
    getExchangeRates(),
  ]);
  const estimatedPrice =
    place.priceAmount != null
      ? formatConvertedPrice(place.priceAmount, preferredCurrency, rates, locale)
      : null;

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <Breadcrumbs
        items={[
          { label: place.city.country.name, href: `/countries/${countrySlug}` },
          { label: place.city.name, href: `/countries/${countrySlug}/${citySlug}` },
          { label: place.name },
        ]}
      />

      <div className="mt-4">
        <PhotoGallery
          photos={place.photos}
          alt={`${place.name} ${t("photoAlt")}`}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap gap-2">
            <span
              className={`inline-block rounded-md px-3 py-1 font-mono text-xs uppercase tracking-wide ${CATEGORY_THEME[place.category].chip} ${CATEGORY_THEME[place.category].chipText}`}
            >
              {tCategories(place.category)}
            </span>
            {place.bestSeason !== "ALL" && (
              <span
                className={`inline-block rounded-md bg-ink px-3 py-1 font-mono text-xs uppercase tracking-wide ${
                  place.bestSeason === "SUMMER" ? "text-gold-soft" : "text-slate"
                }`}
              >
                {place.bestSeason === "SUMMER"
                  ? tFilters("seasonSummer")
                  : tFilters("seasonWinter")}
              </span>
            )}
          </div>
          <h1 className="mt-2 font-serif text-3xl font-medium text-ink-text">{place.name}</h1>
        </div>
        <div className="flex items-center gap-3">
          <StarRating avgRating={place.avgRating} reviewCount={place.reviewCount} />
          <FavoriteButton
            placeId={place.id}
            path={placePath}
            isFavorited={favoriteIds.has(place.id)}
            addLabel={t("addToFavorites")}
            removeLabel={t("removeFromFavorites")}
            variant="inline"
          />
        </div>
      </div>

      {place.description && (
        <p className="mt-4 max-w-2xl text-ink-text/70">{place.description}</p>
      )}

      <div className="mt-6 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
        {place.address && (
          <p>
            <span className="font-mono text-xs uppercase tracking-wide text-ink-text/60">{t("address")}:</span>{" "}
            <span className="text-ink-text/80">{place.address}</span>
          </p>
        )}
        {place.phone && (
          <p>
            <span className="font-mono text-xs uppercase tracking-wide text-ink-text/60">{t("phone")}:</span>{" "}
            <span className="text-ink-text/80">{place.phone}</span>
          </p>
        )}
        {place.website && (
          <p>
            <span className="font-mono text-xs uppercase tracking-wide text-ink-text/60">{t("website")}:</span>{" "}
            <a
              href={place.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:text-rust"
            >
              {place.website}
            </a>
          </p>
        )}
        {estimatedPrice && (
          <p title={t("priceEstimateNote")}>
            <span className="font-mono text-xs uppercase tracking-wide text-ink-text/60">
              {t(`priceLabelByCategory.${place.category}`)}:
            </span>{" "}
            <span className="text-ink-text/80">~{estimatedPrice}</span>
          </p>
        )}
        <p>
          <span className="font-mono text-xs uppercase tracking-wide text-ink-text/60">{t("bestSeason")}:</span>{" "}
          <span className="text-ink-text/80">
            {place.bestSeason === "SUMMER"
              ? tFilters("seasonSummer")
              : place.bestSeason === "WINTER"
                ? tFilters("seasonWinter")
                : tFilters("seasonAll")}
          </span>
        </p>
        {openingHours && (
          <div>
            <span className="font-mono text-xs uppercase tracking-wide text-ink-text/60">{t("openingHours")}:</span>
            <ul className="mt-1 text-ink-text/80">
              {Object.entries(openingHours).map(([days, hours]) => (
                <li key={days}>
                  {days}: {hours}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-8">
        <PlaceMap
          latitude={place.latitude}
          longitude={place.longitude}
          address={place.address}
          name={place.name}
        />
      </div>

      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl text-ink-text">{t("reviewsHeading")}</h2>
            <p className="mt-1 font-mono text-xs uppercase tracking-wide text-ink-text/50">
              {t("editorCuratedNote")}
            </p>
          </div>
          {!session?.user && (
            <WriteReviewCta
              label={t("writeReviewCta")}
              href={`/login?intent=review&callbackUrl=${encodeURIComponent(placePath)}`}
            />
          )}
        </div>
        {session?.user && (
          <div className="mb-6">
            <ReviewForm
              placeId={place.id}
              path={`/countries/${countrySlug}/${citySlug}/${placeSlug}`}
              ratingLabel={tReview("rating")}
              titleLabel={tReview("titleLabel")}
              bodyLabel={tReview("bodyLabel")}
              submitLabel={tReview("submit")}
            />
          </div>
        )}
        <ReviewList
          reviews={place.reviews}
          locale={locale}
          anonymousLabel={t("anonymous")}
          noReviewsLabel={t("noReviews")}
        />
      </div>
    </div>
  );
}

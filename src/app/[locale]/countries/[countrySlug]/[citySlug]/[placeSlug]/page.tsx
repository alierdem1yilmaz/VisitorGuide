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
import { getPlaceBySlug } from "@/lib/queries";
import { auth } from "@/auth";

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

  const [t, tCategories, tReview, session] = await Promise.all([
    getTranslations("place"),
    getTranslations("categories"),
    getTranslations("review"),
    auth(),
  ]);

  const openingHours = isPlainObject(place.openingHours) ? place.openingHours : null;

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
          <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
            {tCategories(place.category)}
          </span>
          <h1 className="mt-2 text-3xl font-bold text-brand-800">{place.name}</h1>
        </div>
        <StarRating avgRating={place.avgRating} reviewCount={place.reviewCount} />
      </div>

      {place.description && (
        <p className="mt-4 max-w-2xl text-muted">{place.description}</p>
      )}

      <div className="mt-6 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
        {place.address && (
          <p>
            <span className="font-medium text-brand-700">{t("address")}:</span>{" "}
            <span className="text-muted">{place.address}</span>
          </p>
        )}
        {place.phone && (
          <p>
            <span className="font-medium text-brand-700">{t("phone")}:</span>{" "}
            <span className="text-muted">{place.phone}</span>
          </p>
        )}
        {place.website && (
          <p>
            <span className="font-medium text-brand-700">{t("website")}:</span>{" "}
            <a
              href={place.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-600 hover:underline"
            >
              {place.website}
            </a>
          </p>
        )}
        {openingHours && (
          <div>
            <span className="font-medium text-brand-700">{t("openingHours")}:</span>
            <ul className="mt-1 text-muted">
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
          <h2 className="text-xl font-bold text-brand-800">{t("reviewsHeading")}</h2>
          {!session?.user && <WriteReviewCta label={t("writeReviewCta")} />}
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

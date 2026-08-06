import Image from "next/image";
import { Link } from "@/i18n/navigation";
import StarRating from "./StarRating";
import FavoriteButton from "./FavoriteButton";

const SEASON_BADGE_CLASS: Record<"SUMMER" | "WINTER", string> = {
  SUMMER: "bg-amber-50/95 text-amber-700",
  WINTER: "bg-sky-50/95 text-sky-700",
};

export default function PlaceCard({
  href,
  name,
  description,
  coverImageUrl,
  avgRating,
  reviewCount,
  priceLevel,
  categoryLabel,
  season,
  seasonLabel,
  estimatedPrice,
  priceEstimateLabel,
  favorite,
}: {
  href: string;
  name: string;
  description: string | null;
  coverImageUrl: string | null;
  avgRating: number;
  reviewCount: number;
  priceLevel: number | null;
  categoryLabel: string;
  season?: "SUMMER" | "WINTER";
  seasonLabel?: string;
  estimatedPrice?: string;
  priceEstimateLabel?: string;
  favorite?: {
    placeId: string;
    path: string;
    isFavorited: boolean;
    addLabel: string;
    removeLabel: string;
  };
}) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-brand-100 bg-white transition-shadow hover:shadow-lg">
      <Link href={href} aria-label={name} className="absolute inset-0 z-10">
        <span className="sr-only">{name}</span>
      </Link>
      <div className="relative h-44 w-full bg-brand-50">
        {coverImageUrl && (
          <Image
            src={coverImageUrl}
            alt={name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          />
        )}
        <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-brand-700">
          {categoryLabel}
        </span>
        {season && seasonLabel && (
          <span
            className={`pointer-events-none absolute left-3 top-11 rounded-full px-2.5 py-1 text-xs font-medium ${SEASON_BADGE_CLASS[season]}`}
          >
            {seasonLabel}
          </span>
        )}
        {favorite && (
          <div className="relative z-20">
            <FavoriteButton
              placeId={favorite.placeId}
              path={favorite.path}
              isFavorited={favorite.isFavorited}
              addLabel={favorite.addLabel}
              removeLabel={favorite.removeLabel}
            />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-semibold text-brand-800">{name}</h3>
        {description && (
          <p className="line-clamp-2 text-sm text-muted">{description}</p>
        )}
        <div className="mt-auto flex items-center justify-between pt-2">
          <StarRating avgRating={avgRating} reviewCount={reviewCount} />
          <div className="text-right">
            {priceLevel && (
              <span className="block text-sm font-medium text-brand-600">
                {"$".repeat(priceLevel)}
              </span>
            )}
            {estimatedPrice && (
              <span
                className="block text-xs text-muted"
                title={priceEstimateLabel}
              >
                ~{estimatedPrice}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

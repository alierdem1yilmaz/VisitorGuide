import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Category } from "@/generated/prisma/client";
import { CATEGORY_THEME } from "@/lib/categoryTheme";
import Stamp from "@/components/ui/Stamp";
import FavoriteButton from "./FavoriteButton";

const SEASON_BADGE_CLASS: Record<"SUMMER" | "WINTER", string> = {
  SUMMER: "text-gold-soft",
  WINTER: "text-slate",
};

export default function PlaceCard({
  href,
  name,
  description,
  coverImageUrl,
  category,
  avgRating,
  reviewCount,
  priceLevel,
  categoryLabel,
  season,
  seasonLabel,
  estimatedPrice,
  priceEstimateLabel,
  priceCategoryLabel,
  favorite,
}: {
  href: string;
  name: string;
  description: string | null;
  coverImageUrl: string | null;
  category: Category;
  avgRating: number;
  reviewCount: number;
  priceLevel: number | null;
  categoryLabel: string;
  season?: "SUMMER" | "WINTER";
  seasonLabel?: string;
  estimatedPrice?: string;
  priceEstimateLabel?: string;
  priceCategoryLabel?: string;
  favorite?: {
    placeId: string;
    path: string;
    isFavorited: boolean;
    addLabel: string;
    removeLabel: string;
  };
}) {
  const theme = CATEGORY_THEME[category];

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-ink-text/10 bg-ink-2 transition-shadow hover:shadow-lg hover:shadow-ink/20">
      <Link href={href} aria-label={name} className="absolute inset-0 z-10">
        <span className="sr-only">{name}</span>
      </Link>
      <div className="relative h-44 w-full bg-paper-2">
        {coverImageUrl && (
          <Image
            src={coverImageUrl}
            alt={name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          />
        )}
        <span
          className={`pointer-events-none absolute left-3 top-3 rounded-md px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide ${theme.chip} ${theme.chipText}`}
        >
          {categoryLabel}
        </span>
        {season && seasonLabel && (
          <span
            className={`pointer-events-none absolute left-3 top-11 rounded-md bg-ink/80 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide ${SEASON_BADGE_CLASS[season]}`}
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
        <h3 className="font-serif text-lg text-paper">{name}</h3>
        {description && (
          <p className="line-clamp-2 text-sm text-slate">{description}</p>
        )}
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <Stamp value={avgRating.toFixed(1)} size="sm" tone="onInk" />
            <span className="font-mono text-xs text-slate">({reviewCount})</span>
          </div>
          <div className="text-right">
            {priceLevel && (
              <span className="block font-mono text-sm font-medium text-gold-soft">
                {"$".repeat(priceLevel)}
              </span>
            )}
            {estimatedPrice && (
              <span
                className="block text-xs text-slate/80"
                title={priceEstimateLabel}
              >
                {priceCategoryLabel && `${priceCategoryLabel}: `}~{estimatedPrice}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

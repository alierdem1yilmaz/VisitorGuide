import Image from "next/image";
import { Link } from "@/i18n/navigation";
import StarRating from "./StarRating";

export default function PlaceCard({
  href,
  name,
  description,
  coverImageUrl,
  avgRating,
  reviewCount,
  priceLevel,
  categoryLabel,
}: {
  href: string;
  name: string;
  description: string | null;
  coverImageUrl: string | null;
  avgRating: number;
  reviewCount: number;
  priceLevel: number | null;
  categoryLabel: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-xl border border-brand-100 bg-white transition-shadow hover:shadow-lg"
    >
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
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-brand-700">
          {categoryLabel}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-semibold text-brand-800">{name}</h3>
        {description && (
          <p className="line-clamp-2 text-sm text-muted">{description}</p>
        )}
        <div className="mt-auto flex items-center justify-between pt-2">
          <StarRating avgRating={avgRating} reviewCount={reviewCount} />
          {priceLevel && (
            <span className="text-sm font-medium text-brand-600">
              {"$".repeat(priceLevel)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

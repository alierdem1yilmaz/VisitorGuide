import Image from "next/image";
import { Link } from "@/i18n/navigation";
import StarRating from "./StarRating";

export type HighlightPlace = {
  id: string;
  href: string;
  name: string;
  coverImageUrl: string | null;
  avgRating: number;
  reviewCount: number;
};

export default function HighlightRow({
  label,
  places,
}: {
  label: string;
  places: HighlightPlace[];
}) {
  if (places.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="mb-3 text-lg font-bold text-brand-800">{label}</h2>
      <div className="-mx-6 flex gap-4 overflow-x-auto px-6 pb-2">
        {places.map((place) => (
          <Link
            key={place.id}
            href={place.href}
            className="group w-56 flex-shrink-0 overflow-hidden rounded-xl border border-brand-100 bg-white transition-shadow hover:shadow-lg"
          >
            <div className="relative h-36 w-full bg-brand-50">
              {place.coverImageUrl && (
                <Image
                  src={place.coverImageUrl}
                  alt={place.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="224px"
                />
              )}
            </div>
            <div className="p-3">
              <h3 className="truncate text-sm font-semibold text-brand-800">
                {place.name}
              </h3>
              <div className="mt-1">
                <StarRating avgRating={place.avgRating} reviewCount={place.reviewCount} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

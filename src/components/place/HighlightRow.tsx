import Image from "next/image";
import { Link } from "@/i18n/navigation";
import Stamp from "@/components/ui/Stamp";

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
      <h2 className="mb-3 font-serif text-lg text-ink-text">{label}</h2>
      <div className="-mx-6 flex gap-4 overflow-x-auto px-6 pb-2">
        {places.map((place) => (
          <Link
            key={place.id}
            href={place.href}
            className="group w-56 flex-shrink-0 overflow-hidden rounded-xl border border-ink-text/10 bg-ink-2 transition-shadow hover:shadow-lg hover:shadow-ink/20"
          >
            <div className="relative h-36 w-full bg-paper-2">
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
              <h3 className="truncate font-serif text-sm text-paper">{place.name}</h3>
              <div className="mt-1.5 flex items-center gap-2">
                <Stamp value={place.avgRating.toFixed(1)} size="sm" tone="onInk" />
                <span className="font-mono text-xs text-slate">({place.reviewCount})</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

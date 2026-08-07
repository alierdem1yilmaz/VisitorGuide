import { Link } from "@/i18n/navigation";
import PhotoCarousel from "@/components/place/PhotoCarousel";

export default function CityCard({
  href,
  name,
  description,
  photos,
  placeCountLabel,
  previousLabel,
  nextLabel,
}: {
  href: string;
  name: string;
  description: string | null;
  photos: { url: string; alt: string }[];
  placeCountLabel: string;
  previousLabel: string;
  nextLabel: string;
}) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-ink-text/10 bg-ink-2 transition-shadow hover:shadow-lg hover:shadow-ink/20">
      <Link href={href} aria-label={name} className="absolute inset-0 z-10">
        <span className="sr-only">{name}</span>
      </Link>
      <div className="relative z-20">
        {photos.length > 0 ? (
          <PhotoCarousel
            photos={photos}
            previousLabel={previousLabel}
            nextLabel={nextLabel}
            variant="card"
          />
        ) : (
          <div className="h-56 w-full bg-paper-2" />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-serif text-xl text-paper">{name}</h3>
        {description && (
          <p className="line-clamp-2 text-sm text-slate">{description}</p>
        )}
        <span className="mt-auto pt-2 font-mono text-xs uppercase tracking-wide text-gold-soft">
          {placeCountLabel}
        </span>
      </div>
    </div>
  );
}

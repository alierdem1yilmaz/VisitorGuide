import { Link } from "@/i18n/navigation";
import PhotoCarousel from "@/components/place/PhotoCarousel";

export default function CountryCard({
  href,
  name,
  description,
  photos,
  cityCountLabel,
  previousLabel,
  nextLabel,
}: {
  href: string;
  name: string;
  description: string | null;
  photos: { url: string; alt: string }[];
  cityCountLabel: string;
  previousLabel: string;
  nextLabel: string;
}) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-brand-100 bg-white transition-shadow hover:shadow-lg">
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
          <div className="h-56 w-full bg-brand-50" />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-lg font-semibold text-brand-800">{name}</h3>
        {description && (
          <p className="line-clamp-2 text-sm text-muted">{description}</p>
        )}
        <span className="mt-auto pt-2 text-sm font-medium text-brand-600">
          {cityCountLabel}
        </span>
      </div>
    </div>
  );
}

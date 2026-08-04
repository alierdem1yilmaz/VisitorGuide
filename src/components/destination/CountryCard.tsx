import Image from "next/image";
import { Link } from "@/i18n/navigation";

export default function CountryCard({
  href,
  name,
  description,
  coverImageUrl,
  cityCountLabel,
}: {
  href: string;
  name: string;
  description: string | null;
  coverImageUrl: string | null;
  cityCountLabel: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-xl border border-brand-100 bg-white transition-shadow hover:shadow-lg"
    >
      <div className="relative h-40 w-full bg-brand-50">
        {coverImageUrl && (
          <Image
            src={coverImageUrl}
            alt={name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          />
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
    </Link>
  );
}

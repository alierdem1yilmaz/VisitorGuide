import Image from "next/image";
import { Link } from "@/i18n/navigation";
import StarRating from "@/components/place/StarRating";
import FavoriteButton from "@/components/place/FavoriteButton";

export default function FavoriteListItem({
  favorite,
  removeLabel,
}: {
  favorite: {
    placeId: string;
    place: {
      name: string;
      slug: string;
      avgRating: number;
      reviewCount: number;
      city: { slug: string; country: { slug: string } };
      photos: { url: string }[];
    };
  };
  removeLabel: string;
}) {
  const placePath = `/countries/${favorite.place.city.country.slug}/${favorite.place.city.slug}/${favorite.place.slug}`;
  const coverUrl = favorite.place.photos[0]?.url;

  return (
    <div className="flex items-center gap-4 border-b border-brand-100 pb-6 last:border-0">
      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-brand-50">
        {coverUrl && (
          <Image src={coverUrl} alt={favorite.place.name} fill className="object-cover" sizes="64px" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <Link href={placePath} className="font-medium text-brand-800 hover:underline">
          {favorite.place.name}
        </Link>
        <div className="mt-1">
          <StarRating avgRating={favorite.place.avgRating} reviewCount={favorite.place.reviewCount} />
        </div>
      </div>
      <FavoriteButton
        placeId={favorite.placeId}
        path="/profile"
        isFavorited
        addLabel={removeLabel}
        removeLabel={removeLabel}
        variant="inline"
      />
    </div>
  );
}

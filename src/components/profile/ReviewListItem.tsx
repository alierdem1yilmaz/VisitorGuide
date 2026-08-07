import { Link } from "@/i18n/navigation";
import StarRating from "@/components/place/StarRating";
import DeleteReviewButton from "./DeleteReviewButton";

export default function ReviewListItem({
  review,
  locale,
  deleteLabel,
  deleteConfirm,
}: {
  review: {
    id: string;
    rating: number;
    title: string | null;
    body: string | null;
    createdAt: Date;
    place: {
      name: string;
      slug: string;
      city: { slug: string; country: { slug: string } };
    };
  };
  locale: string;
  deleteLabel: string;
  deleteConfirm: string;
}) {
  const formatter = new Intl.DateTimeFormat(locale, { dateStyle: "medium" });
  const placePath = `/countries/${review.place.city.country.slug}/${review.place.city.slug}/${review.place.slug}`;

  return (
    <div className="border-b border-ink-text/10 pb-6 last:border-0">
      <div className="flex items-center justify-between">
        <Link href={placePath} className="font-serif text-ink-text hover:text-gold">
          {review.place.name}
        </Link>
        <span className="font-mono text-xs text-ink-text/50">
          {formatter.format(review.createdAt)}
        </span>
      </div>
      <div className="mt-1">
        <StarRating avgRating={review.rating} />
      </div>
      {review.title && (
        <h4 className="mt-2 font-serif font-semibold text-ink-text">{review.title}</h4>
      )}
      {review.body && <p className="mt-1 text-ink-text/70">{review.body}</p>}
      <div className="mt-2">
        <DeleteReviewButton
          reviewId={review.id}
          placePath={placePath}
          label={deleteLabel}
          confirmMessage={deleteConfirm}
        />
      </div>
    </div>
  );
}

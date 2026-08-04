import StarRating from "./StarRating";

export default function ReviewList({
  reviews,
  locale,
  anonymousLabel,
  noReviewsLabel,
}: {
  reviews: {
    id: string;
    rating: number;
    title: string | null;
    body: string | null;
    createdAt: Date;
    user: { name: string | null };
  }[];
  locale: string;
  anonymousLabel: string;
  noReviewsLabel: string;
}) {
  if (reviews.length === 0) {
    return <p className="text-muted">{noReviewsLabel}</p>;
  }

  const formatter = new Intl.DateTimeFormat(locale, { dateStyle: "medium" });

  return (
    <div className="flex flex-col gap-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b border-brand-100 pb-6 last:border-0">
          <div className="flex items-center justify-between">
            <span className="font-medium text-brand-800">
              {review.user.name ?? anonymousLabel}
            </span>
            <span className="text-sm text-muted">
              {formatter.format(review.createdAt)}
            </span>
          </div>
          <div className="mt-1">
            <StarRating avgRating={review.rating} />
          </div>
          {review.title && (
            <h4 className="mt-2 font-semibold text-brand-800">{review.title}</h4>
          )}
          {review.body && <p className="mt-1 text-muted">{review.body}</p>}
        </div>
      ))}
    </div>
  );
}

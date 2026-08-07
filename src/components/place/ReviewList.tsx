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
    return <p className="text-ink-text/60">{noReviewsLabel}</p>;
  }

  const formatter = new Intl.DateTimeFormat(locale, { dateStyle: "medium" });

  return (
    <div className="flex flex-col gap-4">
      {reviews.map((review) => {
        const displayName = review.user.name ?? anonymousLabel;
        return (
          <div key={review.id} className="rounded-xl bg-paper-2 p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-2 font-serif italic text-paper">
                {displayName[0]?.toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-serif text-ink-text">{displayName}</span>
                  <span className="font-mono text-xs text-ink-text/50">
                    {formatter.format(review.createdAt)}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-2">
              <StarRating avgRating={review.rating} />
            </div>
            {review.title && (
              <h4 className="mt-2 font-serif font-semibold text-ink-text">{review.title}</h4>
            )}
            {review.body && <p className="mt-1 text-ink-text/70">{review.body}</p>}
          </div>
        );
      })}
    </div>
  );
}

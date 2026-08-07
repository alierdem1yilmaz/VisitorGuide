export function Star({
  filled,
  className,
}: {
  filled: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={className ?? `h-4 w-4 ${filled ? "text-rust" : "text-ink-text/15"}`}
      fill="currentColor"
    >
      <path d="M10 1.5l2.59 5.25 5.79.84-4.19 4.08.99 5.77L10 14.77l-5.18 2.67.99-5.77-4.19-4.08 5.79-.84L10 1.5z" />
    </svg>
  );
}

export default function StarRating({
  avgRating,
  reviewCount,
}: {
  avgRating: number;
  reviewCount?: number;
}) {
  const rounded = Math.round(avgRating);

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {Array.from({ length: 5 }, (_, i) => (
          <Star key={i} filled={i < rounded} />
        ))}
      </div>
      {reviewCount !== undefined && (
        <span className="text-sm text-ink-text/60">({reviewCount})</span>
      )}
    </div>
  );
}

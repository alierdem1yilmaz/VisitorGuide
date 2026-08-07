import { toggleFavorite } from "@/lib/actions/favorites";

export default function FavoriteButton({
  placeId,
  path,
  isFavorited,
  addLabel,
  removeLabel,
  variant = "overlay",
}: {
  placeId: string;
  path: string;
  isFavorited: boolean;
  addLabel: string;
  removeLabel: string;
  variant?: "overlay" | "inline";
}) {
  const label = isFavorited ? removeLabel : addLabel;

  return (
    <form action={toggleFavorite} className={variant === "overlay" ? "absolute right-3 top-3" : undefined}>
      <input type="hidden" name="placeId" value={placeId} />
      <input type="hidden" name="path" value={path} />
      <button
        type="submit"
        aria-label={label}
        title={label}
        className={
          variant === "overlay"
            ? "flex h-8 w-8 items-center justify-center rounded-full bg-ink/80 text-paper shadow-sm transition-colors hover:bg-ink"
            : "flex items-center gap-1.5 rounded-full border border-ink-text/15 px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-ink-text transition-colors hover:bg-paper-2"
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={isFavorited ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={2}
          className={variant === "overlay" ? "h-4 w-4" : "h-4 w-4 text-red-500"}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 20.25c-.3 0-.6-.09-.85-.27C7.1 17 3 13.36 3 9.5 3 6.83 5.1 4.75 7.75 4.75c1.53 0 2.97.73 3.85 1.9a4.7 4.7 0 0 1 3.85-1.9C18.1 4.75 20.25 6.83 20.25 9.5c0 3.86-4.1 7.5-8.15 10.48-.25.18-.55.27-.85.27Z"
          />
        </svg>
        {variant === "inline" && <span>{label}</span>}
      </button>
    </form>
  );
}

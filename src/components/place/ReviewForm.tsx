"use client";

import { useState } from "react";
import { submitReview } from "@/lib/actions/reviews";
import { Star } from "./StarRating";

export default function ReviewForm({
  placeId,
  path,
  ratingLabel,
  titleLabel,
  bodyLabel,
  submitLabel,
}: {
  placeId: string;
  path: string;
  ratingLabel: string;
  titleLabel: string;
  bodyLabel: string;
  submitLabel: string;
}) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);

  return (
    <form
      action={submitReview}
      className="flex flex-col gap-3 rounded-xl border border-ink-2 bg-ink p-4"
    >
      <input type="hidden" name="placeId" value={placeId} />
      <input type="hidden" name="path" value={path} />
      <input type="hidden" name="rating" value={rating} />

      <div>
        <span className="mb-1 block font-mono text-xs uppercase tracking-wide text-slate">
          {ratingLabel}
        </span>
        <div className="flex gap-1">
          {Array.from({ length: 5 }, (_, i) => i + 1).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              onMouseEnter={() => setHovered(value)}
              onMouseLeave={() => setHovered(0)}
              aria-label={`${value}`}
              className="p-0.5"
            >
              <Star
                filled={value <= (hovered || rating)}
                className={`h-6 w-6 ${
                  value <= (hovered || rating) ? "text-rust" : "text-ink-3"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <input
        type="text"
        name="title"
        placeholder={titleLabel}
        className="rounded-md border border-ink-3 bg-ink-2 px-3 py-2 text-sm text-paper placeholder:text-slate focus:outline-none focus:ring-2 focus:ring-gold-soft"
      />
      <textarea
        name="body"
        placeholder={bodyLabel}
        rows={3}
        className="rounded-md border border-ink-3 bg-ink-2 px-3 py-2 text-sm text-paper placeholder:text-slate focus:outline-none focus:ring-2 focus:ring-gold-soft"
      />

      <button
        type="submit"
        disabled={rating === 0}
        className="self-start rounded-full bg-gold-soft px-5 py-2 font-mono text-xs uppercase tracking-wide text-ink transition-colors hover:bg-gold disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitLabel}
      </button>
    </form>
  );
}

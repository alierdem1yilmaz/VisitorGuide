"use client";

import { useState } from "react";
import { submitReview } from "@/lib/actions/reviews";

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
      className="flex flex-col gap-3 rounded-xl border border-brand-100 bg-white p-4"
    >
      <input type="hidden" name="placeId" value={placeId} />
      <input type="hidden" name="path" value={path} />
      <input type="hidden" name="rating" value={rating} />

      <div>
        <span className="mb-1 block text-sm font-medium text-brand-700">
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
              <svg
                viewBox="0 0 20 20"
                className={`h-6 w-6 ${
                  value <= (hovered || rating) ? "text-accent-500" : "text-brand-100"
                }`}
                fill="currentColor"
              >
                <path d="M10 1.5l2.59 5.25 5.79.84-4.19 4.08.99 5.77L10 14.77l-5.18 2.67.99-5.77-4.19-4.08 5.79-.84L10 1.5z" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      <input
        type="text"
        name="title"
        placeholder={titleLabel}
        className="rounded-md border border-brand-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
      />
      <textarea
        name="body"
        placeholder={bodyLabel}
        rows={3}
        className="rounded-md border border-brand-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
      />

      <button
        type="submit"
        disabled={rating === 0}
        className="self-start rounded-full bg-brand-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitLabel}
      </button>
    </form>
  );
}

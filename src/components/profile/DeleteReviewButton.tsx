"use client";

import { deleteReview } from "@/lib/actions/reviews";

export default function DeleteReviewButton({
  reviewId,
  placePath,
  label,
  confirmMessage,
}: {
  reviewId: string;
  placePath: string;
  label: string;
  confirmMessage: string;
}) {
  return (
    <form
      action={deleteReview}
      onSubmit={(e) => {
        if (!confirm(confirmMessage)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="reviewId" value={reviewId} />
      <input type="hidden" name="placePath" value={placePath} />
      <button
        type="submit"
        className="text-sm font-medium text-red-600 hover:underline"
      >
        {label}
      </button>
    </form>
  );
}

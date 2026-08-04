export default function WriteReviewCta({ label }: { label: string }) {
  return (
    <button
      type="button"
      disabled
      aria-disabled
      className="cursor-not-allowed rounded-full border border-brand-100 bg-brand-50 px-5 py-2.5 text-sm font-medium text-brand-400"
    >
      {label}
    </button>
  );
}

import { Link } from "@/i18n/navigation";

export default function WriteReviewCta({ label }: { label: string }) {
  return (
    <Link
      href="/login"
      className="rounded-full border border-brand-100 bg-white px-5 py-2.5 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-50"
    >
      {label}
    </Link>
  );
}

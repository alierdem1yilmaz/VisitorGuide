import { Link } from "@/i18n/navigation";

export default function WriteReviewCta({
  label,
  href,
}: {
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-full border border-ink-text/15 bg-paper px-5 py-2.5 font-mono text-xs uppercase tracking-wide text-ink-text transition-colors hover:bg-paper-2"
    >
      {label}
    </Link>
  );
}

import { Link } from "@/i18n/navigation";

export default function Breadcrumbs({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav className="flex flex-wrap items-center gap-1.5 font-mono text-xs uppercase tracking-wide text-ink-text/60">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <span>/</span>}
          {item.href ? (
            <Link href={item.href} className="hover:text-gold">
              {item.label}
            </Link>
          ) : (
            <span className="text-ink-text">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

import { Link } from "@/i18n/navigation";

export default function Breadcrumbs({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <span>/</span>}
          {item.href ? (
            <Link href={item.href} className="hover:text-brand-700">
              {item.label}
            </Link>
          ) : (
            <span className="text-brand-700">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

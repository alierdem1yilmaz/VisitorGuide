import { Link } from "@/i18n/navigation";

export default function ViewToggle({
  basePath,
  category,
  view,
  gridLabel,
  mapLabel,
}: {
  basePath: string;
  category?: string;
  view: "grid" | "map";
  gridLabel: string;
  mapLabel: string;
}) {
  function hrefFor(target: "grid" | "map") {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (target === "map") params.set("view", "map");
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  function tabClass(target: "grid" | "map") {
    return `rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wide transition-colors ${
      view === target
        ? "bg-gold text-ink"
        : "border border-ink-text/15 bg-paper text-ink-text hover:bg-paper-2"
    }`;
  }

  return (
    <div className="flex gap-2">
      <Link href={hrefFor("grid")} className={tabClass("grid")}>
        {gridLabel}
      </Link>
      <Link href={hrefFor("map")} className={tabClass("map")}>
        {mapLabel}
      </Link>
    </div>
  );
}

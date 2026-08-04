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
    return `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
      view === target
        ? "bg-brand-600 text-white"
        : "border border-brand-100 bg-white text-brand-700 hover:bg-brand-50"
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

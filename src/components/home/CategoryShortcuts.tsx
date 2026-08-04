import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Category } from "@/generated/prisma/client";

const ICONS: Record<Category, string> = {
  RESTAURANT: "M6 2v7a2 2 0 002 2v9M10 2v18M15 2c-1.5 2-1.5 6 0 8v10",
  ATTRACTION: "M12 2l3 6 6 1-4.5 4.5L17.5 20 12 17l-5.5 3 1-6.5L3 9l6-1z",
  MONUMENT: "M12 2l8 6H4l8-6zM6 10v10M12 10v10M18 10v10M3 22h18",
  HOTEL: "M3 21V8l9-5 9 5v13M9 21v-6h6v6M3 12h18",
  NATURE: "M12 2C8 6 6 10 6 13a6 6 0 0012 0c0-3-2-7-6-11z",
};

const CATEGORIES: Category[] = [
  Category.RESTAURANT,
  Category.ATTRACTION,
  Category.MONUMENT,
  Category.HOTEL,
  Category.NATURE,
];

export default async function CategoryShortcuts() {
  const t = await getTranslations("categories");

  return (
    <section className="mx-auto max-w-6xl px-6 pb-16">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        {CATEGORIES.map((category) => (
          <Link
            key={category}
            href={`/search?category=${category}`}
            className="flex flex-col items-center gap-2 rounded-xl border border-brand-100 bg-white px-4 py-6 text-center transition-shadow hover:shadow-lg"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-7 w-7 text-brand-600"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path d={ICONS[category]} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-sm font-medium text-brand-800">{t(category)}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

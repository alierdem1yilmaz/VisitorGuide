"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Category } from "@/generated/prisma/client";
import { CATEGORY_THEME } from "@/lib/categoryTheme";

const ICONS: Record<Category, string> = {
  RESTAURANT: "M6 2v7a2 2 0 002 2v9M10 2v18M15 2c-1.5 2-1.5 6 0 8v10",
  ATTRACTION: "M12 2l3 6 6 1-4.5 4.5L17.5 20 12 17l-5.5 3 1-6.5L3 9l6-1z",
  MONUMENT: "M12 2l8 6H4l8-6zM6 10v10M12 10v10M18 10v10M3 22h18",
  HOTEL: "M3 21V8l9-5 9 5v13M9 21v-6h6v6M3 12h18",
  NATURE: "M12 2C8 6 6 10 6 13a6 6 0 0012 0c0-3-2-7-6-11z",
};

export type ShowcasePlace = {
  id: string;
  href: string;
  name: string;
  photoUrl: string | null;
  cityName: string;
  countryName: string;
};

export default function CategoryShowcaseRow({
  category,
  label,
  viewAllHref,
  viewAllLabel,
  places,
}: {
  category: Category;
  label: string;
  viewAllHref: string;
  viewAllLabel: string;
  places: ShowcasePlace[];
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (places.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % places.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [places.length]);

  if (places.length === 0) return null;
  const active = places[index];

  return (
    <section className="mx-auto max-w-6xl px-6 pb-12">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6 text-gold"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path d={ICONS[category]} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h2 className="font-serif text-2xl font-medium text-ink-text">{label}</h2>
        </div>
        <Link
          href={viewAllHref}
          className="font-mono text-xs uppercase tracking-wide text-gold hover:text-rust"
        >
          {viewAllLabel} &rarr;
        </Link>
      </div>

      <Link
        href={active.href}
        className="group relative block h-72 w-full overflow-hidden rounded-2xl bg-paper-2 sm:h-96"
      >
        {places.map((place, i) => (
          <div
            key={place.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          >
            {place.photoUrl && (
              <Image
                src={place.photoUrl}
                alt={place.name}
                fill
                priority={i === 0}
                className="object-cover transition-transform duration-[4000ms] ease-linear group-hover:scale-105"
                sizes="(min-width: 1024px) 1152px, 100vw"
              />
            )}
          </div>
        ))}

        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-t ${CATEGORY_THEME[category].scrimFrom} via-ink/10 to-transparent`}
        />

        <span className="absolute right-4 top-4 rounded-md bg-ink/70 px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-paper">
          {active.cityName}, {active.countryName}
        </span>

        <span className="absolute bottom-4 left-4 font-serif text-2xl font-medium text-white drop-shadow">
          {active.name}
        </span>
      </Link>
    </section>
  );
}

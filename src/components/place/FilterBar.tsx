"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";

export default function FilterBar({
  sortLabel,
  ratingLabel,
  priceLabel,
  searchPlaceholder,
  sortOptions,
  ratingAnyLabel,
  priceAnyLabel,
}: {
  sortLabel: string;
  ratingLabel: string;
  priceLabel: string;
  searchPlaceholder: string;
  sortOptions: {
    rating: string;
    priceAsc: string;
    priceDesc: string;
    distance: string;
  };
  ratingAnyLabel: string;
  priceAnyLabel: string;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const sort = searchParams.get("sort") ?? "rating";
  const minRating = searchParams.get("minRating") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  function updateParam(key: string, value: string, defaultValue: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === defaultValue) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  useEffect(() => {
    const current = searchParams.get("q") ?? "";
    if (query === current) return;
    const timer = setTimeout(() => updateParam("q", query, ""), 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const controlClass =
    "rounded-md border border-ink-text/15 bg-paper px-3 py-2 text-sm font-mono text-ink-text focus:outline-none focus:ring-2 focus:ring-gold";

  return (
    <div className="flex flex-wrap gap-3">
      <input
        type="search"
        aria-label={searchPlaceholder}
        placeholder={searchPlaceholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={`${controlClass} w-full sm:w-56`}
      />

      <select
        aria-label={sortLabel}
        value={sort}
        onChange={(e) => updateParam("sort", e.target.value, "rating")}
        className={controlClass}
      >
        <option value="rating">{sortOptions.rating}</option>
        <option value="priceAsc">{sortOptions.priceAsc}</option>
        <option value="priceDesc">{sortOptions.priceDesc}</option>
        <option value="distance">{sortOptions.distance}</option>
      </select>

      <select
        aria-label={ratingLabel}
        value={minRating}
        onChange={(e) => updateParam("minRating", e.target.value, "")}
        className={controlClass}
      >
        <option value="">{ratingAnyLabel}</option>
        <option value="3">3+ ★</option>
        <option value="4">4+ ★</option>
        <option value="4.5">4.5+ ★</option>
      </select>

      <select
        aria-label={priceLabel}
        value={maxPrice}
        onChange={(e) => updateParam("maxPrice", e.target.value, "")}
        className={controlClass}
      >
        <option value="">{priceAnyLabel}</option>
        <option value="1">$</option>
        <option value="2">$$</option>
        <option value="3">$$$</option>
        <option value="4">$$$$</option>
      </select>
    </div>
  );
}

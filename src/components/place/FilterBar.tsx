"use client";

import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";

export default function FilterBar({
  sortLabel,
  ratingLabel,
  priceLabel,
  sortOptions,
  ratingAnyLabel,
  priceAnyLabel,
}: {
  sortLabel: string;
  ratingLabel: string;
  priceLabel: string;
  sortOptions: {
    name: string;
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

  const sort = searchParams.get("sort") ?? "name";
  const minRating = searchParams.get("minRating") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";

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

  const selectClass =
    "rounded-full border border-brand-100 bg-white px-3 py-2 text-sm text-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-400";

  return (
    <div className="flex flex-wrap gap-3">
      <select
        aria-label={sortLabel}
        value={sort}
        onChange={(e) => updateParam("sort", e.target.value, "name")}
        className={selectClass}
      >
        <option value="name">{sortOptions.name}</option>
        <option value="rating">{sortOptions.rating}</option>
        <option value="priceAsc">{sortOptions.priceAsc}</option>
        <option value="priceDesc">{sortOptions.priceDesc}</option>
        <option value="distance">{sortOptions.distance}</option>
      </select>

      <select
        aria-label={ratingLabel}
        value={minRating}
        onChange={(e) => updateParam("minRating", e.target.value, "")}
        className={selectClass}
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
        className={selectClass}
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

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

export default function SearchForm() {
  const t = useTranslations("home");
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-xl overflow-hidden rounded-full border border-brand-100 bg-white shadow-sm"
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t("searchPlaceholder")}
        className="flex-1 px-5 py-3 text-brand-800 outline-none placeholder:text-muted"
      />
      <button
        type="submit"
        className="bg-brand-600 px-6 py-3 font-medium text-white transition-colors hover:bg-brand-700"
      >
        {t("searchButton")}
      </button>
    </form>
  );
}

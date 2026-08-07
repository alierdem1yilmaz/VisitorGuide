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
      className="mx-auto flex w-full max-w-xl overflow-hidden rounded-full border border-ink-text/15 bg-paper shadow-sm"
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t("searchPlaceholder")}
        className="flex-1 px-5 py-3 text-ink-text outline-none placeholder:text-ink-text/50"
      />
      <button
        type="submit"
        className="bg-ink px-6 py-3 font-mono text-xs uppercase tracking-wide text-paper transition-colors hover:bg-ink-2"
      >
        {t("searchButton")}
      </button>
    </form>
  );
}

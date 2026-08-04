"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const LABELS: Record<string, string> = {
  tr: "Türkçe",
  en: "English",
  de: "Deutsch",
  fr: "Français",
  ru: "Русский",
  zh: "中文",
};

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <select
      aria-label="Language"
      value={locale}
      onChange={(e) => router.replace(pathname, { locale: e.target.value })}
      className="rounded-md border border-brand-100 bg-white px-2 py-1 text-sm text-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-400"
    >
      {routing.locales.map((l) => (
        <option key={l} value={l}>
          {LABELS[l]}
        </option>
      ))}
    </select>
  );
}

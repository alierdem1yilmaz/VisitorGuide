"use client";

import { useTranslations } from "next-intl";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-24 text-center">
      <h1 className="font-serif text-2xl font-medium text-ink-text">{t("heading")}</h1>
      <p className="mt-3 text-ink-text/60">{t("message")}</p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-6 rounded-full bg-ink px-5 py-2.5 font-mono text-xs uppercase tracking-wide text-paper transition-colors hover:bg-ink-2"
      >
        {t("retry")}
      </button>
    </div>
  );
}

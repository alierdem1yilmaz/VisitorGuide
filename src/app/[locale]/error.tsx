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
      <h1 className="text-2xl font-bold text-brand-800">{t("heading")}</h1>
      <p className="mt-3 text-muted">{t("message")}</p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-6 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
      >
        {t("retry")}
      </button>
    </div>
  );
}

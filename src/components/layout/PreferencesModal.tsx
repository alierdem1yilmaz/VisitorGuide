"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { regions, currencyOptions, type Region } from "@/data/regions";
import { setCurrencyCookie } from "@/lib/actions/preferences";

type Labels = {
  title: string;
  regionTab: string;
  currencyTab: string;
  searchPlaceholder: string;
  close: string;
};

export default function PreferencesModal({
  currentLocale,
  currentCurrency,
  labels,
}: {
  currentLocale: string;
  currentCurrency: string;
  labels: Labels;
}) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"region" | "currency">("region");
  const [query, setQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const activeRegion =
    regions.find((r) => r.locale === currentLocale) ?? regions[0];

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  function selectRegion(region: Region) {
    router.replace(pathname, { locale: region.locale });
    setOpen(false);
  }

  async function selectCurrency(code: string) {
    await setCurrencyCookie(code);
    setOpen(false);
    router.refresh();
  }

  const filteredRegions = regions.filter((r) =>
    `${r.countryLabel} ${r.languageLabel}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-full border border-paper/25 px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-paper transition-colors hover:bg-paper/10 hover:text-gold-soft"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="h-4 w-4"
        >
          <circle cx="12" cy="12" r="9" strokeLinecap="round" />
          <path
            strokeLinecap="round"
            d="M3 12h18M12 3c2.5 2.5 3.75 5.5 3.75 9s-1.25 6.5-3.75 9c-2.5-2.5-3.75-5.5-3.75-9S9.5 5.5 12 3Z"
          />
        </svg>
        <span>
          {activeRegion.flag} {currentCurrency}
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setOpen(false)}
          role="presentation"
        >
          <div
            className="flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-paper shadow-xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={labels.title}
          >
            <div className="flex items-center justify-between border-b border-ink-text/10 p-4">
              <h2 className="font-serif text-lg text-ink-text">{labels.title}</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={labels.close}
                className="rounded-full p-1 text-ink-text hover:bg-paper-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="h-5 w-5"
                >
                  <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <div className="flex border-b border-ink-text/10">
              <button
                type="button"
                onClick={() => setTab("region")}
                className={`flex-1 px-4 py-3 font-mono text-xs uppercase tracking-wide transition-colors ${
                  tab === "region"
                    ? "border-b-2 border-gold text-ink-text"
                    : "text-ink-text/50 hover:text-ink-text"
                }`}
              >
                {labels.regionTab}
              </button>
              <button
                type="button"
                onClick={() => setTab("currency")}
                className={`flex-1 px-4 py-3 font-mono text-xs uppercase tracking-wide transition-colors ${
                  tab === "currency"
                    ? "border-b-2 border-gold text-ink-text"
                    : "text-ink-text/50 hover:text-ink-text"
                }`}
              >
                {labels.currencyTab}
              </button>
            </div>

            <div className="overflow-y-auto p-4">
              {tab === "region" ? (
                <>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={labels.searchPlaceholder}
                    className="mb-4 w-full rounded-md border border-ink-text/15 bg-paper px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {filteredRegions.map((r) => (
                      <button
                        key={r.code}
                        type="button"
                        onClick={() => selectRegion(r)}
                        className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                          r.locale === currentLocale
                            ? "border-gold bg-paper-2"
                            : "border-ink-text/15 hover:bg-paper-2"
                        }`}
                      >
                        <div className="font-serif text-ink-text">
                          {r.flag} {r.countryLabel}
                        </div>
                        <div className="font-mono text-xs text-ink-text/60">{r.languageLabel}</div>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {currencyOptions.map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => selectCurrency(code)}
                      className={`rounded-lg border px-3 py-2 font-mono text-sm transition-colors ${
                        code === currentCurrency
                          ? "border-gold bg-paper-2 text-ink-text"
                          : "border-ink-text/15 text-ink-text hover:bg-paper-2"
                      }`}
                    >
                      {code}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

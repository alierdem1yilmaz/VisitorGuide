import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-ink-text/10 bg-paper-2">
      <div className="mx-auto max-w-6xl px-6 py-6 font-mono text-xs uppercase tracking-wide text-ink-text/60">
        <p>VisitorGuide — {t("rights")}</p>
        <p className="mt-1">{t("trustNote")}</p>
      </div>
    </footer>
  );
}

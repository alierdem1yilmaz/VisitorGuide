import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-brand-100 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-6 text-sm text-muted">
        <p>VisitorGuide — {t("rights")}</p>
        <p className="mt-1">{t("trustNote")}</p>
      </div>
    </footer>
  );
}

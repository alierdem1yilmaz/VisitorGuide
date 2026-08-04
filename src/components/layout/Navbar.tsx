import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const t = useTranslations("nav");

  return (
    <header className="border-b border-brand-100 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Logo />
          <span className="hidden text-xs font-medium tracking-widest text-muted sm:inline">
            {t("tagline")}
          </span>
        </Link>
        <LanguageSwitcher />
      </div>
    </header>
  );
}

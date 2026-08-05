import { cookies } from "next/headers";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { auth, signOut } from "@/auth";
import { regions } from "@/data/regions";
import { CURRENCY_COOKIE } from "@/lib/constants";
import Logo from "./Logo";
import PreferencesModal from "./PreferencesModal";

export default async function Navbar() {
  const [t, tAuth, tPreferences, session, locale, cookieStore] = await Promise.all([
    getTranslations("nav"),
    getTranslations("auth"),
    getTranslations("preferences"),
    auth(),
    getLocale(),
    cookies(),
  ]);

  const activeRegion = regions.find((r) => r.locale === locale) ?? regions[0];
  const currentCurrency =
    cookieStore.get(CURRENCY_COOKIE)?.value ?? activeRegion.currencyCode;

  return (
    <header className="border-b border-brand-100 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-6 py-4">
        <div className="flex flex-wrap items-center gap-6">
          <Link href="/" className="flex items-center gap-3">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-5 md:flex">
            <Link
              href="/search"
              className="text-sm font-medium text-brand-700 hover:underline"
            >
              {t("explore")}
            </Link>
            <Link
              href="/search"
              className="text-sm font-medium text-brand-700 hover:underline"
            >
              {t("writeReview")}
            </Link>
            <details className="group relative">
              <summary className="cursor-pointer list-none text-sm font-medium text-brand-700 hover:underline">
                {t("more")}
              </summary>
              <div className="absolute left-0 top-full z-30 mt-2 min-w-40 rounded-lg border border-brand-100 bg-white p-2 shadow-lg">
                <Link
                  href="/"
                  className="block rounded-md px-3 py-2 text-sm text-brand-700 hover:bg-brand-50"
                >
                  {t("allCountries")}
                </Link>
              </div>
            </details>
          </nav>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <Link
            href="/profile"
            aria-label={t("favorites")}
            title={t("favorites")}
            className="flex h-9 w-9 items-center justify-center rounded-full text-brand-700 transition-colors hover:bg-brand-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 20.25c-.3 0-.6-.09-.85-.27C7.1 17 3 13.36 3 9.5 3 6.83 5.1 4.75 7.75 4.75c1.53 0 2.97.73 3.85 1.9a4.7 4.7 0 0 1 3.85-1.9C18.1 4.75 20.25 6.83 20.25 9.5c0 3.86-4.1 7.5-8.15 10.48-.25.18-.55.27-.85.27Z"
              />
            </svg>
          </Link>

          <PreferencesModal
            currentLocale={locale}
            currentCurrency={currentCurrency}
            labels={{
              title: tPreferences("title"),
              regionTab: tPreferences("regionTab"),
              currencyTab: tPreferences("currencyTab"),
              searchPlaceholder: tPreferences("searchPlaceholder"),
              close: tPreferences("close"),
            }}
          />

          {session?.user ? (
            <>
              <Link
                href="/profile"
                className="hidden text-sm font-medium text-brand-700 hover:underline sm:inline"
              >
                {session.user.name ?? session.user.email}
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button
                  type="submit"
                  className="rounded-full border border-brand-100 px-4 py-1.5 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-50"
                >
                  {tAuth("signOut")}
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-brand-900 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-brand-800"
            >
              {tAuth("signIn")}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

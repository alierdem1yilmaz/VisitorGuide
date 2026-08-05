import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { auth, signOut } from "@/auth";
import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";

export default async function Navbar() {
  const [t, tAuth, session] = await Promise.all([
    getTranslations("nav"),
    getTranslations("auth"),
    auth(),
  ]);

  return (
    <header className="border-b border-brand-100 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Logo />
          <span className="hidden text-xs font-medium tracking-widest text-muted sm:inline">
            {t("tagline")}
          </span>
        </Link>
        <div className="flex items-center gap-4">
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
              className="rounded-full border border-brand-100 px-4 py-1.5 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-50"
            >
              {tAuth("signIn")}
            </Link>
          )}
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}

import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { signIn } from "@/auth";
import { signUpWithCredentials } from "@/lib/actions/auth";

export default async function RegisterPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string; callbackUrl?: string; intent?: string }>;
}) {
  const { locale } = await params;
  const { error, callbackUrl, intent } = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations("auth");
  const redirectTo = callbackUrl || "/";

  return (
    <div className="mx-auto max-w-sm px-6 py-16">
      <h1 className="font-serif text-2xl font-medium text-ink-text">{t("signUp")}</h1>

      {intent === "review" && (
        <p className="mt-4 rounded-md border border-ink-text/10 bg-paper-2 px-3 py-2 text-sm text-ink-text/80">
          {t("reviewLoginNotice")}
        </p>
      )}

      {error && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error === "exists" ? t("accountExists") : t("invalidCredentials")}
        </p>
      )}

      <form action={signUpWithCredentials} className="mt-6 flex flex-col gap-4">
        <input type="hidden" name="callbackUrl" value={redirectTo} />
        <input type="hidden" name="intent" value={intent ?? ""} />
        <input
          type="text"
          name="name"
          placeholder={t("name")}
          className="rounded-md border border-ink-text/15 bg-paper px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
        />
        <input
          type="email"
          name="email"
          required
          placeholder={t("email")}
          className="rounded-md border border-ink-text/15 bg-paper px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
        />
        <input
          type="password"
          name="password"
          required
          minLength={8}
          placeholder={t("password")}
          className="rounded-md border border-ink-text/15 bg-paper px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
        />
        <button
          type="submit"
          className="rounded-full bg-ink px-5 py-2.5 font-mono text-xs uppercase tracking-wide text-paper transition-colors hover:bg-ink-2"
        >
          {t("signUp")}
        </button>
      </form>

      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo });
        }}
        className="mt-3"
      >
        <button
          type="submit"
          className="w-full rounded-full border border-ink-text/15 bg-paper px-5 py-2.5 font-mono text-xs uppercase tracking-wide text-ink-text transition-colors hover:bg-paper-2"
        >
          {t("signUpWithGoogle")}
        </button>
      </form>

      <Link
        href={`/login${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`}
        className="mt-4 block text-center font-mono text-xs uppercase tracking-wide text-gold hover:text-rust"
      >
        {t("alreadyHaveAccount")}
      </Link>
    </div>
  );
}

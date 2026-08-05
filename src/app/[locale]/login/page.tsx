import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { signIn } from "@/auth";
import { signInWithCredentials } from "@/lib/actions/auth";

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { locale } = await params;
  const { error } = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations("auth");

  return (
    <div className="mx-auto max-w-sm px-6 py-16">
      <h1 className="text-2xl font-bold text-brand-800">{t("signIn")}</h1>

      {error && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {t("invalidCredentials")}
        </p>
      )}

      <form action={signInWithCredentials} className="mt-6 flex flex-col gap-4">
        <input
          type="email"
          name="email"
          required
          placeholder={t("email")}
          className="rounded-md border border-brand-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
        />
        <input
          type="password"
          name="password"
          required
          placeholder={t("password")}
          className="rounded-md border border-brand-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
        />
        <button
          type="submit"
          className="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
        >
          {t("signIn")}
        </button>
      </form>

      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: "/" });
        }}
        className="mt-3"
      >
        <button
          type="submit"
          className="w-full rounded-full border border-brand-100 bg-white px-5 py-2.5 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-50"
        >
          {t("continueWithGoogle")}
        </button>
      </form>

      <Link
        href="/register"
        className="mt-4 block text-center text-sm text-brand-600 hover:underline"
      >
        {t("noAccountYet")}
      </Link>
    </div>
  );
}

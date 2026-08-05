import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { auth } from "@/auth";
import { getUserReviews } from "@/lib/queries";
import { updateProfile } from "@/lib/actions/profile";
import ReviewListItem from "@/components/profile/ReviewListItem";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session?.user) redirect("/login");

  const [t, tAuth, reviews] = await Promise.all([
    getTranslations("profile"),
    getTranslations("auth"),
    getUserReviews(session.user.id),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold text-brand-800">{t("heading")}</h1>

      <section className="mt-8 rounded-xl border border-brand-100 bg-white p-6">
        <h2 className="text-lg font-semibold text-brand-700">{t("accountInfo")}</h2>
        <form action={updateProfile} className="mt-4 flex flex-col gap-4">
          <div>
            <span className="mb-1 block text-sm font-medium text-brand-700">
              {tAuth("email")}
            </span>
            <p className="text-sm text-muted">{session.user.email}</p>
          </div>
          <label className="flex flex-col gap-1 text-sm font-medium text-brand-700">
            {tAuth("name")}
            <input
              type="text"
              name="name"
              defaultValue={session.user.name ?? ""}
              className="rounded-md border border-brand-100 px-3 py-2 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-brand-700">
            {t("avatarUrlLabel")}
            <input
              type="url"
              name="avatarUrl"
              defaultValue={session.user.image ?? ""}
              placeholder="https://..."
              className="rounded-md border border-brand-100 px-3 py-2 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </label>
          <button
            type="submit"
            className="self-start rounded-full bg-brand-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
          >
            {t("save")}
          </button>
        </form>
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-brand-700">{t("myReviews")}</h2>
        {reviews.length === 0 ? (
          <p className="text-muted">{t("noReviews")}</p>
        ) : (
          <div className="flex flex-col gap-6 rounded-xl border border-brand-100 bg-white p-6">
            {reviews.map((review) => (
              <ReviewListItem
                key={review.id}
                review={review}
                locale={locale}
                deleteLabel={t("delete")}
                deleteConfirm={t("deleteConfirm")}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

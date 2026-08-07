import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { auth } from "@/auth";
import { getUserReviews, getUserFavorites } from "@/lib/queries";
import { updateProfile } from "@/lib/actions/profile";
import ReviewListItem from "@/components/profile/ReviewListItem";
import FavoriteListItem from "@/components/profile/FavoriteListItem";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session?.user) redirect("/login");

  const [t, tAuth, reviews, favorites] = await Promise.all([
    getTranslations("profile"),
    getTranslations("auth"),
    getUserReviews(session.user.id),
    getUserFavorites(session.user.id),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-serif text-3xl font-medium text-ink-text">{t("heading")}</h1>

      <section className="mt-8 rounded-xl border border-ink-text/10 bg-paper-2 p-6">
        <h2 className="font-serif text-lg text-ink-text">{t("accountInfo")}</h2>
        <form action={updateProfile} className="mt-4 flex flex-col gap-4">
          <div>
            <span className="mb-1 block font-mono text-xs uppercase tracking-wide text-ink-text/70">
              {tAuth("email")}
            </span>
            <p className="text-sm text-ink-text/70">{session.user.email}</p>
          </div>
          <label className="flex flex-col gap-1 font-mono text-xs uppercase tracking-wide text-ink-text/70">
            {tAuth("name")}
            <input
              type="text"
              name="name"
              defaultValue={session.user.name ?? ""}
              className="rounded-md border border-ink-text/15 bg-paper px-3 py-2 text-sm font-sans normal-case tracking-normal focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </label>
          <label className="flex flex-col gap-1 font-mono text-xs uppercase tracking-wide text-ink-text/70">
            {t("avatarUrlLabel")}
            <input
              type="url"
              name="avatarUrl"
              defaultValue={session.user.image ?? ""}
              placeholder="https://..."
              className="rounded-md border border-ink-text/15 bg-paper px-3 py-2 text-sm font-sans normal-case tracking-normal focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </label>
          <button
            type="submit"
            className="self-start rounded-full bg-ink px-5 py-2 font-mono text-xs uppercase tracking-wide text-paper transition-colors hover:bg-ink-2"
          >
            {t("save")}
          </button>
        </form>
      </section>

      <section className="mt-8">
        <h2 className="mb-4 font-serif text-lg text-ink-text">{t("myReviews")}</h2>
        {reviews.length === 0 ? (
          <p className="text-ink-text/60">{t("noReviews")}</p>
        ) : (
          <div className="flex flex-col gap-6 rounded-xl border border-ink-text/10 bg-paper-2 p-6">
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

      <section className="mt-8">
        <h2 className="mb-4 font-serif text-lg text-ink-text">{t("myFavorites")}</h2>
        {favorites.length === 0 ? (
          <p className="text-ink-text/60">{t("noFavorites")}</p>
        ) : (
          <div className="flex flex-col gap-6 rounded-xl border border-ink-text/10 bg-paper-2 p-6">
            {favorites.map((favorite) => (
              <FavoriteListItem
                key={favorite.id}
                favorite={favorite}
                removeLabel={t("removeFavorite")}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

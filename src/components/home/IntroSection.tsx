import { Link } from "@/i18n/navigation";
import IntroPhotoShowcase, { type IntroPhoto } from "./IntroPhotoShowcase";

export default function IntroSection({
  heading,
  subtitle,
  ctaLabel,
  photos,
}: {
  heading: string;
  subtitle: string;
  ctaLabel: string;
  photos: IntroPhoto[];
}) {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-16">
      <div className="grid grid-cols-1 gap-8 rounded-3xl bg-brand-800 p-6 sm:grid-cols-2 sm:p-10">
        <IntroPhotoShowcase photos={photos} />
        <div className="flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">{heading}</h2>
          <p className="mt-4 text-brand-100">{subtitle}</p>
          <Link
            href="/search"
            className="mt-6 inline-block w-fit rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-800 transition-colors hover:bg-brand-50"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}

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
      <div className="grid grid-cols-1 gap-8 rounded-3xl bg-ink p-6 sm:grid-cols-2 sm:p-10">
        <IntroPhotoShowcase photos={photos} />
        <div className="flex flex-col justify-center">
          <h2 className="font-serif text-3xl font-medium text-paper sm:text-4xl">{heading}</h2>
          <p className="mt-4 text-slate">{subtitle}</p>
          <Link
            href="/search"
            className="mt-6 inline-block w-fit rounded-full bg-gold-soft px-6 py-3 font-mono text-xs uppercase tracking-wide text-ink transition-colors hover:bg-gold"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}

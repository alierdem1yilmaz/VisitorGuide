import SearchForm from "@/components/search/SearchForm";

export default function Hero({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <section className="relative overflow-hidden px-6 py-16 text-center">
      <svg
        className="pointer-events-none absolute inset-0 mx-auto max-w-6xl opacity-20"
        width="100%"
        height="100%"
        viewBox="0 0 1180 320"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M20,260 Q300,180 480,220 T900,160 T1160,200"
          stroke="#C9A227"
          strokeWidth="1"
          fill="none"
          strokeDasharray="2 8"
        />
        <path
          d="M60,80 Q320,140 560,60 T1100,100"
          stroke="#3F7068"
          strokeWidth="1"
          fill="none"
          strokeDasharray="2 8"
        />
        <circle cx="480" cy="220" r="3" fill="#C9A227" />
        <circle cx="900" cy="160" r="3" fill="#C9A227" />
        <circle cx="560" cy="60" r="3" fill="#3F7068" />
      </svg>
      <div className="relative mx-auto max-w-6xl">
        <h1 className="font-serif text-4xl font-medium text-ink-text sm:text-5xl">{title}</h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-ink-text/60">{subtitle}</p>
        <div className="mt-8">
          <SearchForm />
        </div>
      </div>
    </section>
  );
}

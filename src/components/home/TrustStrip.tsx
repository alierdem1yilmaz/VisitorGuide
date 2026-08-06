function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function TrustStrip({
  heading,
  caption,
  items,
}: {
  heading: string;
  caption: string;
  items: { title: string; description: string }[];
}) {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-16">
      <div className="text-center">
        <h2 className="text-lg font-bold text-brand-800 sm:text-xl">{heading}</h2>
        <p className="mt-2 text-sm text-muted">{caption}</p>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.title}
            className="flex flex-col items-center gap-3 rounded-2xl border border-brand-100 bg-white p-6 text-center"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-50 text-accent-600">
              <CheckIcon />
            </span>
            <h3 className="font-semibold text-brand-800">{item.title}</h3>
            <p className="text-sm text-muted">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

import SearchForm from "@/components/search/SearchForm";

export default function Hero({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 text-center">
      <h1 className="text-4xl font-bold text-brand-800 sm:text-5xl">{title}</h1>
      <p className="mx-auto mt-4 max-w-xl text-lg text-muted">{subtitle}</p>
      <div className="mt-8">
        <SearchForm />
      </div>
    </section>
  );
}

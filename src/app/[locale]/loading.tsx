export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="h-8 w-64 animate-pulse rounded-md bg-brand-100" />
      <div className="mt-4 h-4 w-96 max-w-full animate-pulse rounded-md bg-brand-50" />
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className="animate-pulse overflow-hidden rounded-xl border border-brand-100 bg-white"
          >
            <div className="h-44 w-full bg-brand-50" />
            <div className="flex flex-col gap-2 p-4">
              <div className="h-4 w-3/4 rounded bg-brand-100" />
              <div className="h-3 w-full rounded bg-brand-50" />
              <div className="h-3 w-2/3 rounded bg-brand-50" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

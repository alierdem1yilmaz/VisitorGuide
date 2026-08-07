export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="h-8 w-64 animate-pulse rounded-md bg-paper-2" />
      <div className="mt-4 h-4 w-96 max-w-full animate-pulse rounded-md bg-paper" />
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className="animate-pulse overflow-hidden rounded-xl border border-ink-text/10 bg-paper-2"
          >
            <div className="h-44 w-full bg-paper" />
            <div className="flex flex-col gap-2 p-4">
              <div className="h-4 w-3/4 rounded bg-paper" />
              <div className="h-3 w-full rounded bg-paper" />
              <div className="h-3 w-2/3 rounded bg-paper" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

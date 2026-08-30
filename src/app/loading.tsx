export default function Loading() {
  return (
    <main className="mx-auto px-5 pb-20">
      <section className="border-b border-border py-12 lg:py-14">
        <div className="h-8 w-72 rounded-md bg-card animate-pulse" />
        <div className="h-4 w-96 max-w-full rounded-md bg-card animate-pulse mt-4" />
      </section>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-8">
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card overflow-hidden"
          >
            <div className="aspect-square bg-muted animate-pulse" />
            <div className="p-4 flex flex-col gap-3">
              <div className="h-4 w-2/3 rounded bg-muted animate-pulse" />
              <div className="h-3 w-1/3 rounded bg-muted animate-pulse" />
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}

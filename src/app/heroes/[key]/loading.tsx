export default function HeroLoading() {
  return (
    <main className="mx-auto px-5 py-8">
      <div className="h-4 w-40 rounded bg-card animate-pulse" />
      <div className="mt-6 flex flex-col md:flex-row gap-6">
        <div className="w-full max-w-70 aspect-square rounded-lg bg-card animate-pulse shrink-0" />
        <div className="flex flex-col gap-3 min-w-0 w-full">
          <div className="h-8 w-48 rounded bg-card animate-pulse" />
          <div className="h-4 w-full max-w-xl rounded bg-card animate-pulse" />
          <div className="h-4 w-2/3 max-w-xl rounded bg-card animate-pulse" />
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="h-20 rounded-xl bg-card animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

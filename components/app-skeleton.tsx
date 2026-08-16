export function AppSkeleton() {
  return (
    <main className="min-h-screen" aria-label="Загрузка приложения" aria-busy="true">
      <div className="border-b border-stone-200 bg-white px-4 py-4">
        <div className="mx-auto h-9 max-w-7xl animate-pulse rounded-lg bg-stone-200" />
      </div>
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="h-10 w-2/3 animate-pulse rounded-lg bg-stone-200" />
        <div className="mt-4 h-5 w-1/2 animate-pulse rounded bg-stone-100" />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((item) => <div key={item} className="h-64 animate-pulse rounded-2xl bg-stone-100" />)}
        </div>
      </div>
    </main>
  );
}

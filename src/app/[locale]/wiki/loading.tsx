export default function WikiLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb skeleton */}
      <div className="h-5 w-48 bg-muted rounded animate-pulse mb-6" />

      {/* Title skeleton */}
      <div className="space-y-4 mb-10">
        <div className="h-10 w-3/4 bg-muted rounded animate-pulse" />
        <div className="h-6 w-full max-w-2xl bg-muted rounded animate-pulse" />
      </div>

      {/* Content cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card p-6 space-y-4"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-lg bg-muted animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-3/4 bg-muted rounded animate-pulse" />
                <div className="h-4 w-full bg-muted rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

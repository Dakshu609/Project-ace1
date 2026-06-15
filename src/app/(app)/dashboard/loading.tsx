export default function DashboardLoading() {
  return (
    <div className="space-y-6 p-8">
      {/* Stats skeleton */}
      <div className="grid gap-4 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-lg bg-muted"></div>
        ))}
      </div>

      {/* Content skeleton */}
      <div className="space-y-4">
        <div className="h-8 w-64 animate-pulse rounded bg-muted"></div>
        <div className="h-64 animate-pulse rounded-lg bg-muted"></div>
      </div>
    </div>
  );
}

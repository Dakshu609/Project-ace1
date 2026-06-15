export default function FreelancersLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 h-10 w-64 animate-pulse rounded bg-muted"></div>
      
      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        {/* Filter sidebar skeleton */}
        <div className="h-96 animate-pulse rounded-lg bg-muted"></div>

        {/* Freelancer grid skeleton */}
        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-80 animate-pulse rounded-lg bg-muted"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

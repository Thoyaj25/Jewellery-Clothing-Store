export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      {/* Skeleton Loader */}
      <div className="space-y-8 w-full max-w-7xl px-6">
        {/* Header Skeleton */}
        <div className="h-12 bg-amber-900/20 rounded animate-pulse"></div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-square bg-amber-900/20 rounded animate-pulse"></div>
              <div className="h-4 bg-amber-900/20 rounded animate-pulse"></div>
              <div className="h-4 w-3/4 bg-amber-900/20 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Text */}
      <p className="text-gray-400 text-sm mt-8">Loading your premium collection...</p>
    </div>
  );
}

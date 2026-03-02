'use client';

export default function LoadingSkeleton(): JSX.Element {
  return (
    <div className="w-full max-w-4xl space-y-6 animate-pulse">
      {/* Current Weather Skeleton */}
      <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg p-8 text-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="h-8 bg-white/20 rounded w-3/4"></div>
            <div className="h-16 bg-white/20 rounded w-1/2"></div>
            <div className="h-6 bg-white/20 rounded w-2/3"></div>
          </div>
          <div className="space-y-3">
            <div className="h-6 bg-white/20 rounded w-full"></div>
            <div className="h-6 bg-white/20 rounded w-full"></div>
            <div className="h-6 bg-white/20 rounded w-full"></div>
            <div className="h-6 bg-white/20 rounded w-full"></div>
          </div>
        </div>
      </div>

      {/* Forecast Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="bg-foreground shadow-md rounded-lg p-4 space-y-3">
            <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-12 bg-gray-200 rounded w-16 mx-auto"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-8 bg-neutral-200 rounded w-3/4"></div>
    <div className="h-4 bg-neutral-200 rounded w-full"></div>
    <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
  </div>
);

export const CardSkeleton = () => (
  <div className="animate-pulse bg-white rounded-xl p-6 shadow-md">
    <div className="h-6 bg-neutral-200 rounded w-1/2 mb-4"></div>
    <div className="h-4 bg-neutral-200 rounded w-full mb-2"></div>
    <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
  </div>
);

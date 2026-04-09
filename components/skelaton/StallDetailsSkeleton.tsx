"use client";

function StallDetailsSkeleton() {
  return (
    <div className="flex gap-3  flex-col">
      <div className="h-6 w-40 bg-gray-200 animate-pulse rounded" />
      <div className="h-4 w-32 bg-gray-200 animate-pulse rounded" />
      <div className="h-4 w-60 bg-gray-200 animate-pulse rounded" />
      <div className="flex gap-3">
        <div className="h-8 bg-gray-200 animate-pulse rounded-md flex-1" />
        <div className="h-8 bg-gray-200 animate-pulse rounded-md flex-1" />
      </div>
    </div>
  );
}

export default StallDetailsSkeleton;

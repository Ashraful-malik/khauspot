"use client";

function StallCheckinsSkeleton() {
  return (
    <div className="flex gap-3 items-center">
      <div className="h-6 w-6 bg-gray-200 animate-pulse rounded-full" />
      <div className="h-6 w-40 bg-gray-200 animate-pulse rounded" />
    </div>
  );
}

export default StallCheckinsSkeleton;

"use client";
function ActivityCardSkeleton() {
  return (
    <div className="w-full mx-auto">
      <div className="flex items-center gap-3 p-3 border rounded-xl bg-gray-100 animate-pulse">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gray-300" />

        {/* Text */}
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/2x rounded bg-gray-300" />
          <div className="h-3 w-1/4 rounded bg-gray-300" />
        </div>
      </div>
    </div>
  );
}

export default ActivityCardSkeleton;

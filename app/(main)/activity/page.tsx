"use client";

import PageWrapper from "@/components/layout/PageWrapper";
import { ActivityItemCard } from "@/components/shared/activity-item-card";
import ActivityCardSkeleton from "@/components/skelaton/ActivityCardSkeleton";
import { useGetActivities } from "@/hooks/tanstack/useGetActivities";

export default function ActivityPage() {
  const { data: activities, isLoading } = useGetActivities();

  return (
    <PageWrapper className="max-w-6xl mx-auto overflow-y-auto custom-scrollbar ">
      <div className="px-4 py-4 space-y-4 mb-24 md:mb-0">
        {/* Header */}
        <h1 className="text-lg font-semibold">Activity</h1>

        {/* Feed */}
        <div className="space-y-3">
          {isLoading ? (
            //show skeleton
            Array.from({ length: 5 }).map((_, idx) => (
              <ActivityCardSkeleton key={idx} />
            ))
          ) : activities?.length === 0 ? (
            <ActivityEmptyState />
          ) : (
            activities?.map((item: any) => (
              <ActivityItemCard key={item._id} activities={item} />
            ))
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
export function ActivityEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4">
      <div className="text-4xl mb-3">🧭</div>

      <h3 className="text-lg font-semibold">No activity yet</h3>

      <p className="text-sm text-gray-500 mt-1 max-w-sm">
        When people check in or suggest stalls, you'll see it here.
      </p>

      <button className="mt-4 px-4 py-2 text-sm font-medium bg-black text-white rounded-lg hover:opacity-90 transition">
        Explore stalls
      </button>
    </div>
  );
}

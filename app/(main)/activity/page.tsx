"use client";

import PageWrapper from "@/components/layout/PageWrapper";
import { ActivityItemCard } from "@/components/shared/activity-item-card";

export default function ActivityPage() {
  const activities = [
    {
      id: 1,
      type: "checkin",
      user: "Rahul",
      stall: "Sharma Chai",
      comment: "Best chai in town",
      time: "2 min ago",
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 2,
      type: "suggest",
      user: "Priya",
      stall: "Station Momos",
      comment: "",
      time: "10 min ago",
      avatar:
        "https://images.unsplash.com/photo-1558486012-817176f84c6d?q=80&w=370&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  return (
    <PageWrapper>
      <div className="px-4 py-4 space-y-4">
        {/* Header */}
        <h1 className="text-lg font-semibold">Activity</h1>

        {/* Feed */}
        <div className="space-y-3">
          {activities.length === 0 && <ActivityEmptyState />}
          {activities.map((item) => (
            <ActivityItemCard key={item.id} {...item} />
          ))}
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

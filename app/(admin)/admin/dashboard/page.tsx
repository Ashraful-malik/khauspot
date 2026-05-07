"use client";
import ProjectList from "@/components/admin/project-list";
import SuggestionProjectCardSkeleton from "@/components/skelaton/SuggestionProjectCardSkeleton";
import { Button } from "@/components/ui/button";
import { useStallSuggestions } from "@/hooks/tanstack/useDashboard";
import { useUser } from "@clerk/nextjs";

export default function StallApproval() {
  const { user } = useUser();
  const { data, isLoading, refetch, isFetching } = useStallSuggestions({
    adminId: user?.id,
  });

  return (
    <div>
      {isLoading ? (
        <SuggestionProjectCardSkeleton />
      ) : data?.suggestions?.length === 0 ? (
        <NoSuggestions onRefresh={refetch} isFetching={isFetching} />
      ) : (
        <ProjectList suggestions={data?.suggestions || []} />
      )}
    </div>
  );
}

// Empty State
function NoSuggestions({
  onRefresh,
  isFetching,
}: {
  onRefresh?: () => void;
  isFetching?: boolean;
}) {
  return (
    <div className="w-full flex flex-col items-center justify-center mt-24 text-center px-4">
      {/* Icon */}
      <div className="bg-gray-100 rounded-full p-6 mb-6">
        <span className="text-4xl">📝</span>
      </div>

      {/* Heading */}
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">
        All caught up!
      </h1>

      {/* Subtext */}
      <p className="text-gray-500 max-w-md mb-6">
        There are no stall suggestions waiting for approval right now. New
        submissions will appear here automatically.
      </p>

      {/* Optional action */}
      {onRefresh && (
        <Button onClick={onRefresh} variant="link">
          {isFetching ? "Refreshing..." : "Refresh"}
        </Button>
      )}
    </div>
  );
}

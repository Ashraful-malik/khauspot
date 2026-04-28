"use client";

export type ActivityProps = {
  createdAt: string;
  type: "checkin" | "suggestion";
  stall?: {
    name: string;
  };
  stallName?: string;
  comment?: string;
  user: {
    name: string;
    avatar: string;
  };
  _id: string;
};
export function ActivityItemCard({
  activities,
}: {
  activities: ActivityProps;
}) {
  return (
    <>
      <div className="flex gap-3 p-3 rounded-xl border bg-white hover:bg-gray-50 transition">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
          <img
            src={activities?.user?.avatar || "/images/user.png"}
            onError={(e) => (e.currentTarget.src = "/images/user.png")}
            alt={activities?.user?.name}
            width={40}
            height={40}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm leading-snug">
            <span className="font-light">{activities.user.name}</span>{" "}
            {activities.type === "checkin" && (
              <>
                checked in at{" "}
                <span className="font-medium">{activities.stallName}</span>
              </>
            )}
            {activities?.type === "suggestion" && (
              <>
                suggested{" "}
                <span className="font-medium">{activities.stallName}</span>
              </>
            )}
          </p>

          {activities.comment && (
            <p className="text-sm text-gray-500 mt-1 italic line-clamp-2">
              “{activities.comment}”
            </p>
          )}

          <p className="text-xs text-gray-400 mt-1">
            {DateFormatter(new Date(activities.createdAt))}
          </p>
        </div>
      </div>
    </>
  );
}

function DateFormatter(date: Date) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

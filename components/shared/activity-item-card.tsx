"use client";
import Image from "next/image";

export function ActivityItemCard({
  type,
  user,
  stall,
  comment,
  time,
  avatar,
}: {
  type: string;
  user: string;
  stall: string;
  comment?: string;
  time: string;
  avatar: string;
}) {
  return (
    <div className="flex gap-3 p-3 rounded-xl border bg-white hover:bg-gray-50 transition">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
        <Image
          src={avatar}
          alt={user}
          width={40}
          height={40}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm leading-snug">
          <span className="font-medium">{user}</span>{" "}
          {type === "checkin" && (
            <>
              checked in at <span className="font-medium">{stall}</span>
            </>
          )}
          {type === "suggest" && (
            <>
              suggested <span className="font-medium">{stall}</span>
            </>
          )}
        </p>

        {comment && (
          <p className="text-sm text-gray-500 mt-1 italic line-clamp-2">
            “{comment}”
          </p>
        )}

        <p className="text-xs text-gray-400 mt-1">{time}</p>
      </div>
    </div>
  );
}

"use client";
import { Flame, MapPin } from "lucide-react";

export default function StallCard({
  name,
  checkins,
  distance,
  category,
}: {
  name: string;
  checkins: number;
  distance: number;
  category: string;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl border bg-gray-50 hover:bg-gray-50 transition active:scale-[0.98]">
      {/* LEFT */}
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="text-red-500 mt-1">
          <MapPin size={18} />
        </div>

        {/* Content */}
        <div className="space-y-0.5">
          {/* Name */}
          <h3 className="font-semibold text-sm">{name}</h3>

          {/* Category */}

          <p className="text-xs text-gray-400">{category}</p>

          {/* Check-ins */}
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <Flame size={12} className="text-orange-500" />
            {checkins} check-ins
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="text-sm font-medium text-gray-700">
        {distance < 1 ? (
          <span className="text-xs text-green-600 font-medium">Nearby</span>
        ) : (
          <>{distance.toFixed(1)} km</>
        )}
      </div>
    </div>
  );
}

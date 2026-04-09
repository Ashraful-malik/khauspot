"use client";
import { fetchStallById } from "@/lib/api/stalls";
import { useQueryClient } from "@tanstack/react-query";
import { Flame, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

export default function StallCard({ stall, distance, isExploring }: any) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleClick = async () => {
    // update the distance
    localStorage.setItem("distance", JSON.stringify(distance));
    queryClient.setQueryData(["stall", stall._id], {
      ...stall,
      distance: distance,
    });

    queryClient.prefetchQuery({
      queryKey: ["stall", stall._id],
      queryFn: () => fetchStallById(stall._id),
    });
    router.push(`/stall/${stall._id}`);
  };

  const finalDistance = distance ?? stall.distance ?? null;
  return (
    <div
      className="flex items-center justify-between p-3 rounded-xl border bg-card hover:shadow-lg hover:-translate-y-1 transition-all duration-200 active:scale-[0.98]"
      onClick={handleClick}
    >
      {/* LEFT */}
      <div className="flex items-start gap-3">
        <div className="text-secondary mt-1">
          <MapPin size={18} />
        </div>

        <div className="space-y-0.5">
          <h3 className="text-foreground font-semibold text-base leading-tight">
            {stall.name}
          </h3>

          <p className="text-[11px] text-muted-foreground">{stall.category}</p>

          <p className="text-[11px] text-muted-foreground flex items-center gap-1">
            <Flame size={12} className="text-primary" />
            {stall.checkinCount} check-ins
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex flex-col items-end text-right">
        {finalDistance !== null && (
          <span className="text-xs text-semibold  text-foreground">
            {formatDistance(finalDistance)}
          </span>
        )}

        {finalDistance !== null && finalDistance < 0.5 && (
          <span className="text-[10px] text-green-600 font-medium">Nearby</span>
        )}

        {isExploring && finalDistance !== null && (
          <span className="text-[10px] text-muted-foreground">
            from your location
          </span>
        )}
      </div>
    </div>
  );
}
function formatDistance(distance: number | null) {
  if (!distance) return null;

  if (distance < 0.05) return "Very close";
  if (distance < 0.5) return `${Math.round(distance * 1000)} m away`;
  if (distance < 5) return `${distance.toFixed(1)} km away`;

  return `${Math.round(distance)} km away`;
}

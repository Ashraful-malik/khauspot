"use client";
import { LocateFixed } from "lucide-react";
import { useMap } from "react-leaflet";
import { toast } from "sonner";

export function GoToUserButton({
  setPosition,
}: {
  setPosition: (pos: { lat: number; lng: number }) => void;
}) {
  const map = useMap();

  const handleClick = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        setPosition(coords); // update marker
        map.setView([coords.lat, coords.lng], 16); // move map

        // optional: save for future fallback
        localStorage.setItem("userCoords", JSON.stringify(coords));
      },
      (err) => {
        toast.error(err.message || "Error getting user location ");
      },
    );
  };

  return (
    <button
      onClick={handleClick}
      className="absolute top-3 right-3 z-1000 bg-white px-3 py-1 rounded shadow flex items-center gap-1"
    >
      <LocateFixed size={16} /> My Location
    </button>
  );
}

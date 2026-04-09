"use client";
import { MapPin } from "lucide-react";

function MapLoader() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-primary/5 text-white">
      <div className="relative flex items-center justify-center">
        {/* Pulse */}
        <span className="absolute h-20 w-20 rounded-full  opacity-20 animate-ping"></span>

        {/* Icon */}
        <MapPin className="w-8 h-8 text-primary animate-pulse" />
      </div>

      <p className="mt-4 text-sm text-gray-500 animate-pulse">Loading map...</p>
    </div>
  );
}

export default MapLoader;

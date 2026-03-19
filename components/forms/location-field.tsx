"use client";

import { useUserLocation } from "@/hooks/useUserLocation";
import { MapPin, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function LocationField() {
  const { error, getLocation, loading, location, setManualLocation } =
    useUserLocation();

  const [mode, setMode] = useState<"auto" | "manual">("auto");
  const [manualValue, setManualValue] = useState("");

  // Pre-fill manual input if location already exists
  useEffect(() => {
    if (location?.address) {
      setManualValue(location.address);
    }
  }, [location]);

  return (
    <div className="space-y-2">
      {/* location box */}
      <div
        onClick={() => {
          if (mode === "auto") getLocation();
        }}
        className="flex items-center justify-between bg-gray-100 p-3 rounded-lg cursor-pointer"
      >
        <div className="flex items-center gap-2 text-sm text-gray-600 w-full">
          {mode === "auto" ? (
            <>
              <MapPin className="h-4 w-4 text-red-500" />
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Detecting location...
                </span>
              ) : location ? (
                <span className="truncate max-w-40">{location.address}</span>
              ) : (
                <span>Tap to detect location</span>
              )}
            </>
          ) : (
            <div className="flex items-center gap-2 w-full">
              <input
                autoFocus
                type="text"
                value={manualValue}
                onChange={(e) => setManualValue(e.target.value)}
                placeholder="Enter location"
                className="w-full text-sm bg-transparent outline-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && manualValue.trim()) {
                    setManualLocation(manualValue);
                    setMode("auto");
                  }
                }}
              />

              {/* Save Button */}
              <button
                className="text-xs bg-orange-500 text-white px-2 py-1 rounded-md disabled:opacity-50"
                disabled={!manualValue.trim()}
                onClick={(e) => {
                  e.stopPropagation();
                  setManualLocation(manualValue);
                  setMode("auto");
                }}
              >
                Save
              </button>

              {/* Cancel Button */}
              <button
                className="text-xs text-gray-500"
                onClick={(e) => {
                  e.stopPropagation();
                  setMode("auto");
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Toggle Button */}
        {!loading && mode === "auto" && (
          <button
            className="text-xs text-orange-500 ml-2 whitespace-nowrap"
            onClick={(e) => {
              e.stopPropagation();
              setMode("manual");
            }}
          >
            Enter Manually
          </button>
        )}
      </div>

      {/* Error */}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

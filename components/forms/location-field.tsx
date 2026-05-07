"use client";

import { useUserLocation } from "@/hooks/useUserLocation";
import { MapPin, Loader2, Map } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { Button } from "../ui/button";
import { DEFAULT_LOCATION } from "@/app/(main)/(map)/map/page";

const LocationPicker = dynamic(
  () => import("@/components/forms/LocationPickerModal"),
  { ssr: false },
);

interface LocationFieldProps {
  setLocation: (location: {
    lat: number;
    lng: number;
    address: string;
  }) => void;
  value?: {
    lat: number;
    lng: number;
    address: string;
  };
}

export default function LocationField({
  setLocation,
  value,
}: LocationFieldProps) {
  const { getLocation, loading, location, error } = useUserLocation();
  const [manual, setManual] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // user selected address form map and manual entry
  const [address, setAddress] = useState(value?.address || "");

  const [stallLocation, setStallLocation] = useState(DEFAULT_LOCATION);

  // sync with parent resets
  useEffect(() => {
    setAddress(value?.address || "");
  }, [value]);

  // Sync auto location
  useEffect(() => {
    if (location) {
      const newLocation = {
        lat: location.lat,
        lng: location.lng,
        address: location.address,
      };
      setAddress(location.address);
      setLocation(newLocation);
    }
  }, [location, setLocation]);

  const handleSaveManual = () => {
    if (!stallLocation) return;
    setLocation({
      lat: stallLocation.lat,
      lng: stallLocation.lng,
      address,
    });

    setManual(false);
  };

  // Sync manual location
  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem("userCoords");

    if (stored) {
      setStallLocation(JSON.parse(stored));
    } else if (location) {
      setStallLocation(location);
    }
  }, [location]);

  return (
    <div className="space-y-3">
      {/* 🗺 Map Picker Modal */}
      {isMapOpen && (
        <LocationPicker
          onClose={() => setIsMapOpen(false)}
          onSelect={async (coords) => {
            setIsMapOpen(false);
            setStallLocation(coords);
            console.log("coords from map selection=-===>", coords);

            // 🔥 reverse geocoding
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${coords.lat}&lon=${coords.lng}&format=json`,
            );
            const data = await res.json();

            const address = data.display_name || "Selected location";

            const newLocation = {
              lat: coords.lat,
              lng: coords.lng,
              address,
            };

            setAddress(address);
            setLocation(newLocation);
          }}
          initialPosition={stallLocation}
        />
      )}

      {/* 📍 Selected Location Display */}
      <div className="bg-muted p-2 rounded-lg text-sm flex items-center justify-between">
        <>
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Detecting location...
            </span>
          ) : (
            <>
              {manual ? (
                <div className="flex items-center gap-2 w-full">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Enter detailed address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="py-2 text-sm w-full border rounded px-2"
                  />
                </div>
              ) : address ? (
                <span className="block w-full truncate">{address}</span>
              ) : (
                <span className="text-gray-500">No location selected</span>
              )}
            </>
          )}

          {/* setting manual location address */}

          <div className="mt-2 flex gap-2">
            {manual ? (
              <button
                onClick={handleSaveManual}
                className="text-xs bg-primary text-white px-2 py-1 rounded-md"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => {
                  setManual(true);
                  setTimeout(() => inputRef.current?.focus(), 0);
                }}
                disabled={!address}
                className={`text-xs bg-secondary ${!address && "opacity-50"} text-white px-2 py-1 rounded-md `}
              >
                Edit
              </button>
            )}

            <button
              onClick={() => setManual(false)}
              className="text-xs bg-neutral-200 text-black px-2 py-1 rounded-md"
            >
              Cancel
            </button>
          </div>
        </>
      </div>

      {/* 🔘 Actions */}
      <div className="flex gap-3">
        <Button
          onClick={getLocation}
          className="flex-1 "
          size="sm"
          variant={"outline"}
        >
          <MapPin className="h-4 w-4" />
          Use my location
        </Button>

        <Button
          onClick={() => setIsMapOpen(true)}
          size="sm"
          variant="outline"
          className="flex-1"
        >
          <Map className="h-4 w-4" />
          Pick on map
        </Button>
      </div>

      {/* ❌ Error */}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

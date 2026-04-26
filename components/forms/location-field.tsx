"use client";

import { useUserLocation } from "@/hooks/useUserLocation";
import { MapPin, Loader2, Map } from "lucide-react";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "../ui/button";

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
}

export default function LocationField({ setLocation }: LocationFieldProps) {
  const { getLocation, loading, location, error } = useUserLocation();
  console.log("location from map field ", location);

  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);
  // Sync auto location
  useEffect(() => {
    if (location) {
      const newLocation = {
        lat: location.lat,
        lng: location.lng,
        address: location.address,
      };
      setSelectedAddress(location.address);
      setSelectedLocation(newLocation);
      setLocation(newLocation);
    }
  }, [location, setLocation]);

  return (
    <div className="space-y-3">
      {/* 🗺 Map Picker Modal */}
      {isMapOpen && (
        <LocationPicker
          onClose={() => setIsMapOpen(false)}
          onSelect={async (coords) => {
            setIsMapOpen(false);

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

            setSelectedAddress(address);
            setSelectedLocation(newLocation);
            setLocation(newLocation);
          }}
        />
      )}

      {/* 📍 Selected Location Display */}
      <div className="bg-muted p-3 rounded-lg text-sm">
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Detecting location...
          </span>
        ) : selectedAddress ? (
          <span className="truncate">{selectedAddress}</span>
        ) : (
          <span className="text-gray-500">No location selected</span>
        )}
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

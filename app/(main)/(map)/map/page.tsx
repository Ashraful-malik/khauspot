"use client";
import StallCard from "@/components/shared/stall-card";
import { useNearbyStall } from "@/hooks/tanstack/useNearbyStall";
import { Coords } from "@/types/map";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LocateFixed, LocateOff, Plus } from "lucide-react";
import CardSkeleton from "@/components/skelaton/CardSkeleton";
import MapLoader from "@/components/skelaton/MapLoader";
import { calculateDistance } from "@/lib/utils/distance";
import Link from "next/link";

const StallMap = dynamic(() => import("@/components/map/StallMap"), {
  ssr: false,
});

export const DEFAULT_LOCATION = {
  lat: 23.35,
  lng: 85.33,
};
export default function Page() {
  const [userLocation, setUserLocation] = useState<Coords | null>(null);
  const [mapCenter, setMapCenter] = useState<Coords | null>(null); // dynamic
  const [shouldFlyToLocation, setShouldFlyToLocation] = useState(false);
  const [boundStallData, setBoundStallData] = useState<any[]>([]);
  const [isExploring, setIsExploring] = useState(false);
  const [isMapLoading, setIsMapLoading] = useState(true);

  // prevent map from recentering
  useEffect(() => {
    if (shouldFlyToLocation) {
      setShouldFlyToLocation(false);
    }
  }, [shouldFlyToLocation]);

  // get user location
  useEffect(() => {
    if (!navigator.geolocation) {
      // fallback if browser doesn't support
      setUserLocation(DEFAULT_LOCATION);
      setMapCenter(DEFAULT_LOCATION);
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setMapCenter({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (error) => {
        toast.error("Location access denied", {
          duration: 5000,
          icon: <LocateOff size={16} />,
          style: {
            background: `var(--destructive)`,
            color: "#fff",
            border: "none",
          },
        });
        setUserLocation(DEFAULT_LOCATION);
      },
    );
  }, []);

  // Fetch user nearby stalls
  const { data: nearbyStalls, isLoading } = useNearbyStall(
    userLocation?.lat,
    userLocation?.lng,
  );

  // Locate me button
  const handleUseMyLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setUserLocation(coords);
        setMapCenter(coords);
        setShouldFlyToLocation(true);
        setIsExploring(true);
      },
      (error) => {
        toast.error("Location access denied", {
          duration: 5000,
          icon: <LocateOff size={16} />,
          style: {
            background: `var(--destructive)`,
            color: "#fff",
            border: "none",
          },
        });
      },
    );
  };

  // final  list data
  function getFinalList() {
    const MIN_ITEMS = 12;
    if (isExploring) {
      return boundStallData || [];
    }
    let finalList = boundStallData || [];
    if (finalList.length < MIN_ITEMS && nearbyStalls) {
      const needed = MIN_ITEMS - finalList.length;
      const outside = nearbyStalls?.filter(
        (s: any) => !boundStallData?.some((b) => b._id === s._id),
      );
      finalList = [...finalList, ...outside.slice(0, needed)];
    }
    return finalList;
  }

  function resolveStallDistance(stall: any) {
    const coords = stall.location?.coordinates;
    const stallLocation =
      coords && coords.length === 2 ? { lat: coords[1], lng: coords[0] } : null;
    let finalDistance = null;
    if (userLocation && stallLocation) {
      if (isExploring) {
        // always calculate in explore mode
        finalDistance = calculateDistance(userLocation, stallLocation);
      } else {
        // use backend distance if available
        finalDistance =
          stall.distance ?? calculateDistance(userLocation, stallLocation);
      }
    }

    return finalDistance;
  }

  useEffect(() => {
    if (userLocation) {
      localStorage.setItem("userCoords", JSON.stringify(userLocation));
    }
  }, [userLocation]);

  return (
    <section className="h-full flex flex-col md:flex-row-reverse bg-gray-50">
      {/* MAP */}
      <div className="relative h-[60%]  md:h-full md:flex-[1.5]">
        <StallMap
          setMapCenter={setMapCenter}
          nearbyCoords={mapCenter || DEFAULT_LOCATION}
          shouldFly={shouldFlyToLocation}
          onBoundsStallsChange={setBoundStallData}
          onMapMove={() => setIsExploring(true)}
          onMapReady={() => setIsMapLoading(false)}
        />

        {/* ✅ Locate Me button*/}
        <div className="absolute  right-5 bottom-10 z-999">
          <Button
            onClick={handleUseMyLocation}
            size="icon-lg"
            className="shadow-lg rounded-full"
            disabled={!userLocation}
          >
            <LocateFixed size={22} />
          </Button>
        </div>
        {isMapLoading && (
          <div
            className={`absolute inset-0 z-50 transition-opacity duration-300 ${
              isMapLoading ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <MapLoader />
          </div>
        )}
      </div>

      {/* LIST */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-24 md:pb-6 custom-scrollbar relative">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* HEADING */}
          <h2 className="text-2xl font-semibold">Nearby Street Food</h2>

          {/* CARDS */}
          <div className="flex flex-col gap-4">
            {isLoading || isMapLoading ? (
              <CardSkeleton />
            ) : (
              getFinalList()?.map((stall) => {
                const finalDistance = resolveStallDistance(stall);
                return (
                  <StallCard
                    key={stall._id}
                    stall={stall}
                    distance={finalDistance}
                    isExploring={isExploring}
                  />
                );
              })
            )}

            {/* if empty show this */}
            {!isLoading && !isMapLoading && getFinalList()?.length === 0 && (
              <div className="flex flex-col items-center justify-center text-center py-10 space-y-4">
                <p className="text-lg font-medium">
                  No street food found here 🍜
                </p>

                <p className="text-sm text-muted-foreground max-w-xs">
                  Be the first to add a stall in this area or move the map to
                  explore more.
                </p>

                <div className="flex gap-3">
                  <Button asChild>
                    <Link href="/add">
                      <Plus /> Add Stall
                    </Link>
                  </Button>

                  <Button variant="outline" onClick={handleUseMyLocation}>
                    🗺️ Explore Nearby
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

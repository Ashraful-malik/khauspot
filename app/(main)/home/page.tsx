"use client";
import PageWrapper from "@/components/layout/PageWrapper";
import NearByStall from "@/components/home/nearby-stall";
import HomeCTA from "@/components/home/home-cta";
import { useNearbyStall } from "@/hooks/tanstack/useNearbyStall";
import { useEffect, useState } from "react";
import { Coords } from "@/types/map";
import { toast } from "sonner";
import { DEFAULT_LOCATION } from "../(map)/map/page";
import { LocateOff } from "lucide-react";

export default function Home() {
  const [userCurrentLocation, setUserCurrentLocation] = useState<Coords>();

  const { data: nearbyStalls, isLoading } = useNearbyStall(
    userCurrentLocation?.lat,
    userCurrentLocation?.lng,
  );

  useEffect(() => {
    if (!navigator.geolocation) {
      setUserCurrentLocation(DEFAULT_LOCATION);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserCurrentLocation({
          lat,
          lng,
        });
      },
      () => {
        toast.error("Location access denied", {
          duration: 5000,
          icon: <LocateOff size={16} />,
          style: {
            background: `var(--destructive)`,
            color: "#fff",
            border: "none",
          },
        });
        setUserCurrentLocation(DEFAULT_LOCATION);
      },
    );
  }, []);

  useEffect(() => {
    if (userCurrentLocation) {
      localStorage.setItem("userCoords", JSON.stringify(userCurrentLocation));
    }
  }, [userCurrentLocation]);

  return (
    <PageWrapper>
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="max-w-6xl mx-auto px-4">
          <NearByStall stalls={nearbyStalls} isLoading={isLoading} />
        </div>
      </div>

      <div className="md:hidden sticky bottom-16 z-40 bg-white px-4 py-3 border-t">
        <HomeCTA />
      </div>
    </PageWrapper>
  );
}

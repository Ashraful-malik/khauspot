"use client";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
});

function MapPage() {
  const params = useSearchParams();
  const lat = parseFloat(params.get("lat") || "");
  const lng = parseFloat(params.get("lng") || "");
  const router = useRouter();

  if (isNaN(lat) || isNaN(lng)) {
    return <div>Invalid location</div>;
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* 🗺️ Map */}
      <MapView lat={lat} lng={lng} />

      {/* 📦 Bottom Info Card */}
      <div className="absolute bottom-0 left-0 w-full z-1000 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-4 backdrop-blur-md">
          <h3 className="text-lg font-semibold">Selected Location</h3>

          <p className="text-sm text-gray-500 mt-1">
            Latitude: {lat.toFixed(5)} <br />
            Longitude: {lng.toFixed(5)}
          </p>

          <div className="flex gap-3 mt-4">
            <Button size={"lg"} className="flex-1" asChild>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Navigate
              </a>
            </Button>

            <Button
              size={"lg"}
              className="flex-1"
              variant="outline"
              onClick={() => router.back()}
            >
              Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MapPage;

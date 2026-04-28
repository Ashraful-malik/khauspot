"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet-routing-machine";
import { Button } from "@/components/ui/button";
function Page() {
  const params = useSearchParams();
  const lat = parseFloat(params.get("lat") || "");
  const lng = parseFloat(params.get("lng") || "");
  const router = useRouter();

  const handleNavigate = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, "_blank");
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* 🗺️ Map */}
      <MapContainer center={[lat, lng]} zoom={15} className="w-full h-full z-0">
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[lat, lng]}>
          <Popup>
            📍 Selected Location <br />
            Lat: {lat}, Lng: {lng}
          </Popup>
        </Marker>
      </MapContainer>

      {/* 📦 Bottom Info Card */}
      <div className="absolute bottom-0 left-0 w-full z-1000 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-4 backdrop-blur-md">
          <h3 className="text-lg font-semibold">Selected Location</h3>

          <p className="text-sm text-gray-500 mt-1">
            Latitude: {lat.toFixed(5)} <br />
            Longitude: {lng.toFixed(5)}
          </p>

          <div className="flex gap-3 mt-4">
            <Button size={"lg"} className="flex-1" onClick={handleNavigate}>
              Navigate
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

export default Page;

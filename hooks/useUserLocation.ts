import { useState } from "react";
import axios from "axios";
export function useUserLocation() {
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const setManualLocation = (address: string) => {
    setLocation((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        address,
      };
    });
  };
  const getLocation = async () => {
    setLoading(true);
    setError("");
    try {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          //reverse geocoading
          const res = await axios.get(
            `https://nominatim.openstreetmap.org/reverse`,
            {
              params: {
                lat,
                lon: lng,
                format: "json",
              },
            },
          );
          // const address = res.data.display_name;
          const address = `${res.data.address.leisure},${res.data.address.road},${res.data.address.city}`;
          setLocation({
            lat,
            lng,
            address,
          });
          setLoading(false);
        },
        (err) => {
          setError("Location permission denied");
          setLoading(false);
        },
      );
    } catch (error) {
      setError("Failed to get location");
      setLoading(false);
    }
  };

  return { location, loading, error, getLocation, setManualLocation };
}

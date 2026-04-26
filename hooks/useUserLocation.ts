import { useState } from "react";
import axios from "axios";

type LocationType = {
  lat: number;
  lng: number;
  address: string;
};
export function useUserLocation() {
  const [location, setLocation] = useState<LocationType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  console.log("location from useUserLocation ", location);

  const formatAddress = (data: any) => {
    const addr = data.address || {};

    return [
      addr.road,
      addr.suburb || addr.village,
      addr.city || addr.town,
      addr.state,
    ]
      .filter(Boolean)
      .join(", ");
  };

  // get user location + reverse geocoding
  const getLocation = async () => {
    setLoading(true);
    setError("");
    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 5000, // 5 seconds
          });
        },
      );
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/reverse`,
        {
          params: {
            lat,
            lon: lng,
            format: "json",
          },
          headers: {
            "Accept-Language": "en",
          },
        },
      );
      const address = formatAddress(res.data);
      setLocation({
        lat,
        lng,
        address,
      });
    } catch (err: any) {
      console.log(err);
      if (err.code === 1) {
        setError("Location permission denied");
      } else {
        setError("Failed to get location");
      }
    } finally {
      setLoading(false);
    }
  };

  return { location, loading, error, getLocation };
}

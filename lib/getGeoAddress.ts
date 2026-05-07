import axios from "axios";

type NominatimResponse = {
  display_name: string;
};
export async function getGeoAddress(
  lat: number,
  lng: number,
): Promise<string | null> {
  try {
    const res = await axios.get<NominatimResponse>(
      "https://nominatim.openstreetmap.org/reverse",
      {
        params: {
          lat,
          lon: lng,
          format: "json",
        },
        headers: {
          "User-Agent": "my-app",
        },
      },
    );
    return res.data.display_name ?? null;
  } catch (error) {
    return null;
  }
}

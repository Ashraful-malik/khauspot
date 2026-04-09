import { MapBounds, StallsResponse } from "@/types/stalls";
import axiosClient from "../axios";

export async function getStallsInBounds(
  bounds: MapBounds,
): Promise<StallsResponse> {
  const { data } = await axiosClient.get("/stalls", {
    params: bounds,
  });
  return data;
}

// fetch nearby stalls
export async function fetchNearbyStalls({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}) {
  const { data } = await axiosClient.get("/stalls/nearby", {
    params: {
      lat,
      lng,
    },
  });
  console.log(data);
  return data;
}

// fetch stall by id
export async function fetchStallById(id: string) {
  const { data } = await axiosClient.get(`/stalls/${id}`);
  return data.stall;
}
export async function fetchStallPhotos(id: string) {
  const { data } = await axiosClient.get(`/stalls/${id}/photos`);
  return data.photos;
}
export async function fetchStallCheckins(id: string) {
  const { data } = await axiosClient.get(`/stalls/${id}/checkin`);
  return data.checkins;
}

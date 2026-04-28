import { CreateStall, MapBounds, StallsResponse } from "@/types/stalls";
import axiosClient, { parseAxiosError } from "../axios";

export async function getStallsInBounds(
  bounds: MapBounds,
): Promise<StallsResponse> {
  try {
    const { data } = await axiosClient.get("/stalls", {
      params: bounds,
    });
    return data;
  } catch (error) {
    const parsed = parseAxiosError(error);
    throw parsed;
  }
}

// fetch nearby stalls
export async function fetchNearbyStalls({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}) {
  try {
    const { data } = await axiosClient.get("/stalls/nearby", {
      params: {
        lat,
        lng,
      },
    });
    console.log(data);
    return data;
  } catch (error) {
    const parsed = parseAxiosError(error);
    throw parsed;
  }
}

// fetch stall by id
export async function fetchStallById(id: string) {
  try {
    const { data } = await axiosClient.get(`/stalls/${id}`);
    return data.stall;
  } catch (error) {
    const parsed = parseAxiosError(error);
    throw parsed;
  }
}
// fetch stall photos
export async function fetchStallPhotos(id: string) {
  try {
    const { data } = await axiosClient.get(`/stalls/${id}/photos`);
    return data.photos;
  } catch (error) {
    const parsed = parseAxiosError(error);
    throw parsed;
  }
}
// fetch stall checkins
export async function fetchStallCheckins(id: string) {
  try {
    const { data } = await axiosClient.get(`/stalls/${id}/checkin`);
    return data.checkins;
  } catch (error) {
    const parsed = parseAxiosError(error);
    throw parsed;
  }
}

// create stall
export async function suggestStall(formData: CreateStall) {
  try {
    const { data } = await axiosClient.post("/stalls/suggest-stall", formData);
    return data;
  } catch (error) {
    const parsed = parseAxiosError(error);
    throw parsed;
  }
}

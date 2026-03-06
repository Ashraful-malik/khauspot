import { MapBounds, StallsResponse } from "@/types/stalls";
import axiosClient from "../axios";

export async function fetchStalls(bounds: MapBounds): Promise<StallsResponse> {
  const { data } = await axiosClient.get("/stalls", {
    params: bounds,
  });
  return data;
}

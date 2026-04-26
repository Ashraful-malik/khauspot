import {
  fetchStallById,
  fetchStallCheckins,
  fetchStallPhotos,
  getStallsInBounds,
} from "@/lib/api/stalls";
import { MapBounds } from "@/types/stalls";
import { useQuery } from "@tanstack/react-query";

export function useStalls(bounds: MapBounds | null) {
  return useQuery({
    queryKey: ["stalls", bounds],
    queryFn: () => getStallsInBounds(bounds as MapBounds),
    staleTime: 1000 * 60, //1 min
    enabled: !!bounds,
  });
}
// fetch stall by id
export function useStall(id?: string) {
  return useQuery({
    queryKey: ["stall", id],
    queryFn: () => fetchStallById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, //5 min
    refetchOnMount: false,
  });
}

// fetch stall photos
export function useStallPhotos(id?: string) {
  return useQuery({
    queryKey: ["stall-photos", id],
    queryFn: () => fetchStallPhotos(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

// fetch stall checkins
export function useStallCheckins(id: string) {
  return useQuery({
    queryKey: ["stall-checkins", id],
    queryFn: () => fetchStallCheckins(id),
    enabled: !!id,
  });
}

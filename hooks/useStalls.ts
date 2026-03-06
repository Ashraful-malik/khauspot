import { fetchStalls } from "@/lib/api/stalls";
import { MapBounds } from "@/types/stalls";
import { useQuery } from "@tanstack/react-query";

export function useStalls(bounds: MapBounds | null) {
  return useQuery({
    queryKey: ["stalls", bounds],
    queryFn: () => fetchStalls(bounds as MapBounds),
    staleTime: 1000 * 60, //1 min
    enabled: !!bounds,
  });
}

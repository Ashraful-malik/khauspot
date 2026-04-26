import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchNearbyStalls } from "@/lib/api/stalls";

// fetch nearby stalls
export const useNearbyStall = (lat?: number, lng?: number) => {
  return useQuery({
    queryKey: ["nearby-stall", lat, lng],
    queryFn: () => fetchNearbyStalls({ lat: lat!, lng: lng! }),
    enabled: !!lat && !!lng,
    staleTime: 1000 * 60 * 2, //2 min
    placeholderData: keepPreviousData, // smooth UI (no flicker)
  });
};

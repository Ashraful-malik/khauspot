import { getActivities } from "@/lib/api/activity";
import { useQuery } from "@tanstack/react-query";

// get all the recent activities on the app
export const useGetActivities = () => {
  return useQuery({
    queryKey: ["activities"],
    queryFn: () => getActivities(),
    staleTime: 1000 * 60 * 5, //5 min
    refetchOnMount: false,
  });
};

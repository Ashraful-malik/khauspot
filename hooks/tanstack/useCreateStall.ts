import { suggestStall } from "@/lib/api/stalls";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useSuggestStall = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: suggestStall,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stalls"] });
      queryClient.invalidateQueries({ queryKey: ["nearby-stall"] });
    },
  });
};

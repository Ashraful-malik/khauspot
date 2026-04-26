import { createStall } from "@/lib/api/stalls";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateStall = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createStall,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stalls"] });
      queryClient.invalidateQueries({ queryKey: ["nearby-stall"] });
    },
  });
};

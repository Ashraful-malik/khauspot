import {
  approveSuggestion,
  getStallSuggestions,
  rejectSuggestion,
} from "@/lib/api/dashboard";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// get all stall suggestions
export const useStallSuggestions = ({
  adminId,
}: {
  adminId: string | undefined;
}) => {
  return useQuery({
    queryKey: ["suggestions", adminId],
    queryFn: () => getStallSuggestions(),
    staleTime: 1000 * 60 * 5, //5 min
  });
};
// mutate (approve) suggestion
export const useApproveSuggestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (stallId: string) => approveSuggestion(stallId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suggestions"] });
    },
  });
};

// mutate (reject) suggestion
export const useRejectSuggestion = ({
  adminNote,
}: {
  adminNote: string | undefined;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (stallId: string) => rejectSuggestion({ stallId, adminNote }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suggestions"] });
    },
  });
};

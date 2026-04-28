import axiosClient, { parseAxiosError } from "../axios";

// get all the stall suggestions
export async function getStallSuggestions() {
  try {
    const { data } = await axiosClient.get("/admin/suggestions");
    console.log(data);
    return data;
  } catch (error) {
    const parsed = parseAxiosError(error);
    throw parsed;
  }
}

// approve stall suggestion
export async function approveSuggestion(stallId: string) {
  try {
    const { data } = await axiosClient.post("/admin/approve-stall", {
      stallId,
    });
  } catch (error) {
    const parsed = parseAxiosError(error);
    throw parsed;
  }
}

// reject stall suggestion
export async function rejectSuggestion({
  stallId,
  adminNote,
}: {
  stallId: string;
  adminNote: string | undefined;
}) {
  try {
    const { data } = await axiosClient.post("/admin/reject-stall", {
      stallId,
      adminNote,
    });
    return data;
  } catch (error) {
    const parsed = parseAxiosError(error);
    throw parsed;
  }
}

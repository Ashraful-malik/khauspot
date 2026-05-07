import axiosClient, { parseAxiosError } from "../axios";

// get all activities
export async function getActivities() {
  try {
    const { data } = await axiosClient.get("/activity");
    return data;
  } catch (error) {
    const parsed = parseAxiosError(error);
    throw parsed;
  }
}

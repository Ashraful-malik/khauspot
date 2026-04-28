import axiosClient from "../axios";

// get all activities
export async function getActivities() {
  const { data } = await axiosClient.get("/activity");
  console.log("activities data", data);
  return data;
}

import axiosClient, { parseAxiosError } from "../axios";

export type checkInPayload = {
  stallId: string;
  coordinates: [number, number];
  accuracy?: number;
  comment?: string;
};
export type commentPayload = {
  stallId: string;
  comment: string;
  checkinId: string;
};

// create checkin
export async function createCheckInApi(payload: checkInPayload) {
  try {
    const { stallId, ...body } = payload;
    const { data } = await axiosClient.post(`/stalls/${stallId}/checkin`, body);
    return data;
  } catch (error) {
    const parsed = parseAxiosError(error);
    throw parsed;
  }
}

// add comment on checkin
export async function createCheckInCommentApi(payload: commentPayload) {
  try {
    const { stallId, ...body } = payload;
    const { data } = await axiosClient.post(
      `/stalls/${stallId}/checkin/comment`,
      body,
    );
    return data;
  } catch (error) {
    const parsed = parseAxiosError(error);
    throw parsed;
  }
}

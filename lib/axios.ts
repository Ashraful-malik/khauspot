import axios from "axios";

// ===Axios client===
const axiosClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});
export default axiosClient;

// ===Error handling for axios===
export type ApiError = {
  message: string;
  status: number;
  raw?: unknown;
};

//Axios error handler
export const parseAxiosError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    return {
      message:
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Something went wrong",
      status: error.response?.status || 500,
      raw: error.response?.data,
    };
  }
  return {
    message: "Unexpected error occurred",
    raw: error,
    status: 500,
  };
};

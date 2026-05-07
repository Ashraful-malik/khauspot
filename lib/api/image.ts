import axios from "axios";
import axiosClient, { parseAxiosError } from "../axios";

// cloudinary signature
export async function getSignature() {
  try {
    const { data } = await axiosClient.get("/upload-signature");
    return data;
  } catch (error) {
    const parse = parseAxiosError(error);
    throw parse;
  }
}

// upload image on cloudinary
export async function uploadImageApi({ formData }: { formData: FormData }) {
  try {
    // cloudinary upload
    const { data } = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData,
    );
    return data;
  } catch (error) {
    const errorParse = parseAxiosError(error);
    throw errorParse;
  }
}

// delete image from cloudinary
export async function deleteImage({ publicId }: { publicId: string }) {
  try {
    const { data } = await axiosClient.post("/delete-image", {
      publicId,
    });
    return data;
  } catch (error) {
    const parse = parseAxiosError(error);
    throw parse;
  }
}

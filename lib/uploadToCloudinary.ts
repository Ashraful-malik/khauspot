import { getSignature, uploadImageApi } from "./api/image";

export const uploadImage = async ({ file }: { file: File }) => {
  //get signature
  try {
    const sigRes = await getSignature();
    const { signature, timestamp } = sigRes;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    formData.append("folder", "stalls");
    const data = await uploadImageApi({ formData });

    return {
      url: data.secure_url,
      publicId: data.public_id,
    };
  } catch (error) {
    throw error;
  }
};

import axios from "axios";

export const uploadImage = async ({ file }: { file: File }) => {
  //get signature
  try {
    const sigRes = await axios.get("/api/upload-signature");
    console.log("sigRes", sigRes);
    const { signature, timestamp } = sigRes.data;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    formData.append("folder", "stalls");

    console.log("formData", formData);

    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData,
    );
    const data = res.data;
    return {
      url: data.secure_url,
      publicId: data.public_id,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

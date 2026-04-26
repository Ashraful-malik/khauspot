import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export async function POST(req: Request) {
  const { public_id } = await req.json();
  console.log("public_id", public_id);
  await cloudinary.uploader.destroy(public_id);
  return NextResponse.json({
    message: "Image deleted",
    success: true,
  });
}

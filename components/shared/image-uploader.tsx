"use client";
import { uploadImage } from "@/lib/uploadToCloudinary";
import axios from "axios";
import { UploadCloud } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
type ImageItemsType = {
  id: string;
  file: File;
  preview: string;
  url?: string;
  publicId?: string;
  status: "uploading" | "success" | "error" | "deleting";
};
export type UploadedImageType = {
  url: string;
  publicId: string;
};
type Props = {
  onChange: (images: UploadedImageType[]) => void;
  onUploadingChange?: (uploading: boolean) => void;
};
function ImageUploader({ onChange, onUploadingChange }: Props) {
  const [images, setImages] = useState<ImageItemsType[]>([]);


  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const validFiles = Array.from(files).filter((file) => {
      if (!file.type.startsWith("image/")) return false;
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return false;
      }
      return true;
    });

    if (images.length + validFiles.length > 3) {
      toast.error("You can only upload a maximum of 3 images");
      return;
    }

    const newItems: ImageItemsType[] = validFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      status: "uploading",
    }));

    setImages((prev) => [...prev, ...newItems]);
    newItems.forEach(uploadSingleImage);
  };

  //   upload image
  const uploadSingleImage = async (item: ImageItemsType) => {
    try {
      const { url, publicId } = await uploadImage({ file: item.file });
      setImages((prev) =>
        prev.map((img) =>
          img.id === item.id
            ? { ...img, url, publicId, status: "success" }
            : img,
        ),
      );
    } catch (error) {
      console.log(error);
      setImages((prev) =>
        prev.map((img) =>
          img.id === item.id ? { ...img, status: "error" } : img,
        ),
      );
    }
  };

  //   remove image
  const removeImage = async (id: string) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, status: "deleting" } : img)),
    );
    const img = images.find((i) => i.id === id);
    if (img?.publicId) {
      try {
        await axios.post("/api/delete-image", { publicid: img.publicId });
      } catch (error) {
        console.log("Fail to delete from cloudinary", error);
      }
    }

    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  //   retry upload
  const retryUpload = (item: ImageItemsType) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === item.id ? { ...img, status: "uploading" } : img,
      ),
    );
    uploadSingleImage(item);
  };

  //   send upload url to parent
  useEffect(() => {
    const uploadedImages = images
      .filter(
        (img): img is ImageItemsType & { url: string; publicId: string } =>
          img.status === "success" && !!img.url && !!img.publicId,
      )
      .map((img) => ({
        url: img.url,
        publicId: img.publicId,
      }));

    onChange(uploadedImages);
  }, [images]);
  useEffect(() => {
    const uploading = images.some(
      (img) => img.status === "uploading" || img.status === "deleting",
    );
    onUploadingChange?.(uploading);
  }, [images]);

  return (
    <div className="space-y-4">
      {/* Upload Box */}
      <label className="flex flex-col items-center justify-center border-2 border-dashed p-6 rounded-lg cursor-pointer hover:bg-gray-50  hover:border-secondary">
        <div className="flex flex-col items-center gap-3">
          <UploadCloud className="h-10 w-10 text-gray-400" />
          <p className="text-sm font-semibold text-gray-700">Upload Photo</p>
          <p className="text-xs text-gray-400">(optional)</p>
        </div>
        <span className="text-sm text-gray-500">Click or drag images here</span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>

      {/* Preview Grid */}
      <div className="grid grid-cols-3 gap-3">
        {images.map((img) => (
          <div
            key={img.id}
            className="relative rounded-lg overflow-hidden border"
          >
            <img
              src={img.preview}
              alt=""
              className="w-full h-24 object-cover"
            />

            {/* Uploading */}
            {(img.status === "uploading" || img.status === "deleting") && (
              <div
                className={`absolute inset-0 ${img.status === "uploading" ? "bg-black/50" : "bg-red-500/60"} bg-black/50 flex items-center justify-center text-white text-xs`}
              >
                {img.status === "uploading" ? "Uploading..." : "Deleting..."}
              </div>
            )}

            {/* Error */}
            {img.status === "error" && (
              <div className="absolute inset-0 bg-red-500/60 flex flex-col items-center justify-center text-white text-xs">
                Failed
                <button
                  onClick={() => retryUpload(img)}
                  className="mt-1 underline"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Remove */}
            <button
              onClick={() => removeImage(img.id)}
              className="absolute top-1 right-1 bg-black/60 text-white text-xs px-1 rounded"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ImageUploader;

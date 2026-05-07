"use client";

import { useState, useRef, useEffect } from "react";
import { UploadCloud } from "lucide-react";
import { uploadImage } from "@/lib/uploadToCloudinary";
import { toast } from "sonner";

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (selectedFile: File) => {
    setFile(selectedFile);
    if (selectedFile?.type.startsWith("image/")) {
      const url = URL.createObjectURL(selectedFile);
      setPreview(url);
    }
  };

  // drag and drop support
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  //  upload handle
  const handleUpload = async () => {
    if (!file) {
      toast.error("No file selected");
      return;
    }
    try {
      setIsUploading(true);
      const url = await uploadImage({ file });
      if (!url || typeof url !== "string") {
        throw new Error("Invalid upload response");
      }
      setImageUrl(url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Upload failed", {
        description: "Please try again",
        style: {
          background: `var(--destructive)`,
          color: "#fff",
          border: "none",
        },
      });
    } finally {
      setIsUploading(false);
    }
  };

  // cleanup object url
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div className="w-full">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="cursor-pointer rounded-2xl border-2 border-dashed border-gray-300 bg-linear-to-br from-gray-50 to-white p-6 text-center transition-all hover:border-secondary hover:bg-blue-50"
      >
        <input
          ref={inputRef}
          id="file"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={(e) => e.target.files && handleFile(e.target.files[0])}
        />

        {!preview ? (
          <div className="flex flex-col items-center gap-3">
            <UploadCloud className="h-10 w-10 text-gray-400" />
            <p className="text-sm font-semibold text-gray-700">Upload Photo</p>
            <p className="text-xs text-gray-400">(optional)</p>

            <button
              type="button"
              className="mt-2 rounded-md bg-secondary px-4 py-2 text-sm text-white shadow hover:bg-secondary"
            >
              Choose File
            </button>

            <p className="text-xs text-gray-500">
              Drag & drop or click to upload
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <img
              src={preview}
              alt="preview"
              className="h-32 w-32 rounded-lg object-cover shadow"
            />
            <p className="text-sm text-gray-600">{file?.name}</p>
            {/* upload button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleUpload();
              }}
              disabled={isUploading}
              className="mt-2 rounded-md bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
            >
              {isUploading ? "Uploading..." : "Upload"}
            </button>

            {/* remove button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
                setPreview(null);
              }}
              className="text-xs text-secondary hover:underline"
            >
              Remove
            </button>
          </div>
        )}
      </div>
      {imageUrl && (
        <p className="mt-3 text-xs text-green-600 break-all">
          Uploaded URL: {imageUrl}
        </p>
      )}
    </div>
  );
}

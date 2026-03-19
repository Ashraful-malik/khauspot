"use client";

import { useState, useRef } from "react";
import { UploadCloud } from "lucide-react";

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (selectedFile: File) => {
    setFile(selectedFile);

    if (selectedFile.type.startsWith("image/")) {
      const url = URL.createObjectURL(selectedFile);
      console.log("url", url);
      setPreview(url);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="cursor-pointer rounded-2xl border-2 border-dashed border-gray-300 bg-linear-to-br from-gray-50 to-white p-6 text-center transition-all hover:border-blue-500 hover:bg-blue-50"
      >
        <input
          ref={inputRef}
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
              className="mt-2 rounded-md bg-blue-600 px-4 py-2 text-sm text-white shadow hover:bg-blue-700"
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

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
                setPreview(null);
              }}
              className="text-xs text-red-500 hover:underline"
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

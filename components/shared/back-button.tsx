"use client";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

function BackButton() {
  const router = useRouter();

  return (
    <div className="absolute  top-4 left-4 z-10">
      <button
        onClick={() => router.back()}
        className="bg-white/80 backdrop-blur p-2 rounded-full shadow"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
    </div>
  );
}

export default BackButton;

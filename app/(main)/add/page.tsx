"use client";
import LocationField from "@/components/forms/location-field";
import PageWrapper from "@/components/layout/PageWrapper";
import ImageUploader, {
  UploadedImageType,
} from "@/components/shared/image-uploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateStall } from "@/hooks/tanstack/useCreateStall";
import { STALL_CATEGORIES } from "@/lib/constants";
import { createStallSchema } from "@/lib/validators/stall.validator";
import { useState } from "react";
import { toast } from "sonner";

type StallAddressType = {
  lat: number;
  lng: number;
  address: string;
};
export default function SuggestStall() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [showAll, setShowAll] = useState(false);

  const [stallAddress, setStallAddress] = useState<
    StallAddressType | undefined
  >();
  const [stallImages, setStallImages] = useState<UploadedImageType[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const visibleCategories = showAll
    ? STALL_CATEGORIES
    : STALL_CATEGORIES.slice(0, 3);

  const { mutate, isPending } = useCreateStall();

  const handleSubmit = () => {
    if (!stallAddress) {
      toast.error("Location is required");
      return;
    }

    const coordinates: [number, number] = [stallAddress.lat, stallAddress.lng];
    const result = createStallSchema.safeParse({
      name,
      category,
      coordinates,
      photos: stallImages,
      address: stallAddress.address,
    });
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }
    mutate(result.data, {
      onSuccess() {
        toast.success("Stall created successfully");
        setName("");
        setCategory("");
        setStallAddress(undefined);
        setStallImages([]);
      },
      onError(error) {
        console.log("form submission error", error);
        toast.error("Something went wrong");
      },
    });
  };
  return (
    <PageWrapper className="max-w-6xl mx-auto ">
      <div className="px-4 py-4 space-y-6  pb-24 md:mb-0 overflow-y-auto custom-scrollbar">
        {/* Title */}
        <h1 className="text-2xl font-semibold">Suggest a stall</h1>

        {/* Name Input */}
        <div>
          <p className="text-sm text-foreground mb-1">Stall name</p>
          <Input
            placeholder="e.g. Sharma Chai"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Location (Auto) */}
        <div>
          <p className="text-sm text-foreground mb-2">Location</p>
          <LocationField setLocation={setStallAddress} />
        </div>
        {/* Category Pills (FAST selection) */}
        <div>
          <p className="text-sm text-foreground mb-2">Select category</p>
          <div className="flex flex-wrap gap-2">
            {visibleCategories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`px-3 py-1.5 rounded-full text-sm border ${
                  category === cat.value
                    ? "bg-secondary text-white"
                    : "bg-muted text-gray-700"
                }`}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
          {/* show more or less */}
          {STALL_CATEGORIES.length > 5 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="mt-2 text-xs text-secondary font-medium"
            >
              {showAll ? "Show less" : "Show more"}
            </button>
          )}
        </div>

        {/* Submit Button */}
        <Button
          className={`w-full bg-primary ${isUploading && "opacity-50"} text-white`}
          size="lg"
          disabled={isPending || isUploading}
          onClick={handleSubmit}
        >
          {isPending ? "Submitting..." : "Submit Stall"}
        </Button>

        {/* Optional Upload */}
        <div className="pt-4 border-t ">
          <p className="text-sm text-gray-500 mb-2">Add photo (optional)</p>

          {/* reuse your FileUpload */}

          <ImageUploader
            onChange={(uploadedImages) => setStallImages(uploadedImages)}
            onUploadingChange={setIsUploading}
          />
        </div>
      </div>
    </PageWrapper>
  );
}

"use client";

import LocationField from "@/components/forms/location-field";
import PageWrapper from "@/components/layout/PageWrapper";
import FileUpload from "@/components/shared/file-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { STALL_CATEGORIES } from "@/lib/constants";
import { MapPin } from "lucide-react";
import { useState } from "react";

export default function SuggestStall() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  return (
    <PageWrapper>
      <div className="px-4 py-4 space-y-6 overflow-y-auto mb-24">
        {/* Title */}
        <h1 className="text-lg font-semibold">Suggest a stall</h1>

        {/* Name Input */}
        <div>
          <p className="text-sm text-gray-500 mb-1">Stall name</p>
          <Input
            placeholder="e.g. Sharma Chai"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Location (Auto) */}

        <LocationField />

        {/* Category Pills (FAST selection) */}
        <div className="flex flex-wrap gap-2">
          {STALL_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`px-3 py-1.5 rounded-full text-sm border ${
                category === cat.value
                  ? "bg-[#FF6B35] text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Submit Button */}
        <Button className="w-full bg-[#FF6B35] text-white" size="lg">
          Submit Stall
        </Button>

        {/* Optional Upload */}
        <div className="pt-4 border-t">
          <p className="text-sm text-gray-500 mb-2">Add photo (optional)</p>

          {/* reuse your FileUpload */}
          <FileUpload />
        </div>
      </div>
    </PageWrapper>
  );
}

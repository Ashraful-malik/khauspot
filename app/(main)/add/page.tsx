"use client";

import LocationField from "@/components/forms/location-field";
import PageWrapper from "@/components/layout/PageWrapper";
import FileUpload from "@/components/shared/file-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { STALL_CATEGORIES } from "@/lib/constants";
import { useState } from "react";

export default function SuggestStall() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [showAll, setShowAll] = useState(false);

  const visibleCategories = showAll
    ? STALL_CATEGORIES
    : STALL_CATEGORIES.slice(0, 3);
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
        <LocationField />

        {/* Category Pills (FAST selection) */}
        <div>
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
        <Button className="w-full bg-primary text-white" size="lg">
          Submit Stall
        </Button>

        {/* Optional Upload */}
        <div className="pt-4 border-t ">
          <p className="text-sm text-gray-500 mb-2">Add photo (optional)</p>

          {/* reuse your FileUpload */}
          <FileUpload />
        </div>
      </div>
    </PageWrapper>
  );
}

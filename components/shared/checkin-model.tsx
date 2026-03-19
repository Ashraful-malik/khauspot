"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";

function CheckInModel() {
  const [comment, setComment] = useState<string>("");

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-sm font-medium">Add a quick comment (optional)</h2>

      <input
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Best chaat in town..."
        className="w-full border p-2 rounded-md"
      />
      <Button className="w-full bg-[#FF6B35] text-white">
        Submit Check-in
      </Button>
    </div>
  );
}

export default CheckInModel;

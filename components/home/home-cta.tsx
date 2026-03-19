"use client";
import { Button } from "../ui/button";
import { MapPinned, Plus } from "lucide-react";

export default function HomeCTA() {
  return (
    <div className="bg-white border rounded-xl shadow-md p-3 flex gap-3">
      <Button className="flex-1" size="lg">
        <MapPinned /> Explore Map
      </Button>
      <Button className="flex-1" size="lg" variant="secondary">
        <Plus /> Suggest Stall
      </Button>
    </div>
  );
}

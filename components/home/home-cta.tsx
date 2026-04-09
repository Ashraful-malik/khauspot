"use client";
import { Button } from "../ui/button";
import { MapPinned, Plus } from "lucide-react";

export default function HomeCTA() {
  return (
    <div className="rounded-xl p-3 flex gap-3 h-auto">
      <Button className="flex-1" size="lg">
        <MapPinned /> Explore Map
      </Button>
      <Button className="flex-1" size="lg" variant="outline">
        <Plus /> Suggest Stall
      </Button>
    </div>
  );
}

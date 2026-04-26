"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import { MapPinned, Plus } from "lucide-react";

export default function HomeCTA() {
  return (
    <div className="rounded-xl p-3 flex gap-3 h-auto">
      <Button className="flex-1" size="lg" asChild>
        <Link href="/map">
          <MapPinned /> Explore Map
        </Link>
      </Button>
      <Button className="flex-1" size="lg" variant="outline" asChild>
        <Link href="/add">
          <Plus /> Suggest Stall
        </Link>
      </Button>
    </div>
  );
}

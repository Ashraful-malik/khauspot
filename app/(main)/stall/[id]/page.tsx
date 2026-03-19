"use client";

import PageWrapper from "@/components/layout/PageWrapper";
import BackButton from "@/components/shared/back-button";
import { Button } from "@/components/ui/button";
import { ChevronLeft, CircleCheck, Navigation } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function Stall() {
  const router = useRouter();
  const { id } = useParams();

  // 🔥 MOCK DATA (replace with API later)
  const stall = {
    name: "Dipak Chat",
    category: "Chaat",
    address: "Bus station road near bus stand",
    distance: "1.2 km",
    checkinCount: 24,
    images: [
      "https://images.unsplash.com/photo-1589778314823-d1c2bde0a31b?q=80&w=940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1599033183537-54ff77f58f75?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    checkins: [
      {
        id: 1,
        user: "Ankit",
        comment: "Best chaat in town",
        avatar: "https://images.unsplash.com/photo-1562306525-9c6429e3f556",
      },
      {
        id: 2,
        user: "Rahul",
        comment: "Cheap and tasty",
        avatar: "https://images.unsplash.com/photo-1562306525-9c6429e3f556",
      },
      {
        id: 3,
        user: "Rahul",
        comment: "Cheap and tasty",
        avatar: "https://images.unsplash.com/photo-1562306525-9c6429e3f556",
      },
      {
        id: 4,
        user: "Rahul",
        comment: "Cheap and tasty",
        avatar: "https://images.unsplash.com/photo-1562306525-9c6429e3f556",
      },
    ],
  };

  const [currentImage, setCurrentImage] = useState(0);
  const [isCheckIn, setIsCheckIn] = useState(false);
  const [openModel, setOpenModel] = useState(false);

  return (
    <PageWrapper className="overflow-hidden bg-white ">
      {/* IMAGE SECTION */}
      <div className="relative h-56 w-full">
        {/* Back Button */}
        <BackButton />

        {/* Image */}
        <Image
          src={stall.images[currentImage]}
          alt="stall"
          fill
          className="object-cover"
        />

        {/* Image Dots (if multiple images) */}
        {stall.images.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
            {stall.images.map((_, i) => (
              <div
                key={i}
                onClick={() => setCurrentImage(i)}
                className={`h-2 w-2 rounded-full ${
                  i === currentImage ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* TOP INFO */}
      <div className="px-4 py-4 space-y-4 ">
        {/* Name + Meta */}
        <div>
          <h1 className="text-xl font-semibold">{stall.name}</h1>

          <p className="text-sm text-gray-500">
            {stall.category} • {stall.distance}
          </p>

          <p className="text-sm text-gray-400">{stall.address}</p>
        </div>

        {/* Check-in Count */}
        <div className="text-sm text-orange-500 font-medium">
          🔥 {stall.checkinCount} check-ins
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-3">
          <Button
            className="flex-1 bg-[#FF6B35] text-white"
            onClick={() => setOpenModel(true)}
          >
            <CircleCheck className="mr-2 h-4 w-4" />
            Check In
          </Button>

          <Button variant="secondary" className="flex-1">
            <Navigation className="mr-2 h-4 w-4" />
            Directions
          </Button>
        </div>
      </div>

      {/* SCROLLABLE CHECK-IN SECTION */}
      <div className="flex-1 overflow-y-auto px-4 pb-6">
        <p className="text-sm font-medium text-gray-600 mb-3">
          Recent Check-ins
        </p>
        <div className="space-y-4">
          {stall.checkins.map((item) => (
            <div key={item.id} className="flex gap-3 items-start">
              <Image
                src={item.avatar}
                alt="profile"
                width={40}
                height={40}
                className="rounded-full"
              />

              <div>
                <p className="text-sm font-medium">{item.user}</p>
                <p className="text-sm text-gray-500">{item.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}

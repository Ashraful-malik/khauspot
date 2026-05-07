"use client";

import PageWrapper from "@/components/layout/PageWrapper";
import BackButton from "@/components/shared/back-button";
import CommentModal from "@/components/shared/comment-model";
import RecentCheckinCard, {
  recentCheckinCardProps,
} from "@/components/shared/recent-checkins-card";
import StallCheckinsSkeleton from "@/components/skelaton/StallCheckinsSkeleton";
import StallDetailsSkeleton from "@/components/skelaton/StallDetailsSkeleton";
import { Button } from "@/components/ui/button";
import {
  useCreateCheckIn,
  useCreateCheckInComment,
  useStall,
  useStallCheckins,
  useStallPhotos,
} from "@/hooks/tanstack/useStalls";
import { LocationType, useUserLocation } from "@/hooks/useUserLocation";
import { googleMapNavigate } from "@/lib/googlemap";
import { calculateDistance, formatDistance } from "@/lib/utils/distance";
import { CircleCheck, Navigation } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Stall() {
  const [currentImage, setCurrentImage] = useState(0);
  const [isChecking, setIsChecking] = useState(false);

  // comment model
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [lastCheckinId, setLastCheckinId] = useState<string | null>(null);

  const { id } = useParams<{ id: string }>();
  const { location, loading, getLocation } = useUserLocation();

  // get stall details
  const { data, isLoading } = useStall(id);

  // get stall images
  const { data: stallImages, isLoading: stallImagesLoading } =
    useStallPhotos(id);

  // get stall checkins
  const { data: CheckinsActivity, isLoading: isLoadingCheckinsActivity } =
    useStallCheckins(id);

  // preload next image
  useEffect(() => {
    if (stallImages && currentImage >= stallImages.length) {
      setCurrentImage(0);
    }
  }, [stallImages, currentImage]);

  // preload next image
  useEffect(() => {
    if (!stallImages) return;
    const nextIndex = (currentImage + 1) % stallImages.length;
    const img = new window.Image();
    img.src = stallImages[nextIndex]?.url;
  }, [currentImage, stallImages]);

  // stall location
  const coordinates = data?.location?.coordinates || [];
  const stallLng = coordinates[0];
  const stallLat = coordinates[1];

  // distance
  const distance =
    location && stallLat !== undefined && stallLng !== undefined
      ? calculateDistance(
          { lat: location.lat, lng: location.lng },
          { lat: stallLat, lng: stallLng },
        )
      : null;

  // open google map for navigation
  const handleNavigate = async () => {
    googleMapNavigate({ lat: stallLat, lng: stallLng });
  };

  const { mutate, isPending: isCheckingPending } = useCreateCheckIn();

  const processCheckIn = async (loc: LocationType) => {
    try {
      const distance = calculateDistance(
        {
          lat: loc.lat,
          lng: loc.lng,
        },
        { lat: stallLat, lng: stallLng },
      );

      // low accuracy
      if (loc.accuracy && loc.accuracy > 100) {
        toast.error("Low GPS accuracy. Please enable GPS.");
        return;
      }

      // Too far
      if (distance > 50) {
        toast.error("You are too far to check in");
        return;
      }

      // mutating checkin
      mutate(
        {
          stallId: id,
          coordinates: [loc.lat, loc.lng],

          accuracy: loc.accuracy,
        },
        {
          onSuccess: (response) => {
            toast.success("Check-in successful");
            const {
              data: { id },
            } = response;
            setLastCheckinId(id);
            setShowCommentModal(true);
          },
          onError: (error) => {
            toast.error(error.message);
          },
        },
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  //fetch user location
  useEffect(() => {
    getLocation(false);
  }, []);
  // handle checkin
  const handleCheckIn = async () => {
    setIsChecking(true);
    await getLocation(false);
  };

  useEffect(() => {
    if (!location || !isChecking) return;
    processCheckIn(location);
    setIsChecking(false);
  }, [location, isChecking]);

  // adding comment
  const { mutate: createCheckInComment } = useCreateCheckInComment();
  const handleCommentSubmit = async (comment: string) => {
    if (!comment.trim() || !lastCheckinId) return;

    try {
      await createCheckInComment(
        {
          stallId: id,
          comment,
          checkinId: lastCheckinId,
        },
        {
          onSuccess: () => {
            toast.success("Comment added!");
          },
          onError: (error) => {
            toast.error(error.message || "Failed to add comment");
          },
        },
      );
    } catch {
      toast.error("Failed to save comment");
    }
  };

  return (
    <PageWrapper className="overflow-hidden bg-white max-w-6xl mx-auto">
      {/* IMAGE SECTION */}
      <div className="relative h-56 md:h-64 w-full">
        {/* Back Button */}
        <BackButton />

        {/* Image */}
        {stallImagesLoading ? (
          <div className="h-full w-full bg-gray-200 animate-pulse" />
        ) : stallImages && stallImages.length > 0 ? (
          <Image
            src={stallImages[currentImage]?.url}
            alt="stall image"
            fill
            sizes="100vw"
            quality={75}
            priority={currentImage === 0}
            className="object-cover"
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            No images available
          </div>
        )}
        {stallImages && stallImages.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 z-10">
            {stallImages.map((image: any, i: number) => (
              <div
                key={i}
                onClick={() => setCurrentImage(i)}
                className={`h-2 w-2 rounded-full cursor-pointer transition ${
                  i === currentImage
                    ? "bg-white scale-125"
                    : "bg-white/50 border border-white"
                }`}
              />
            ))}
          </div>
        )}
      </div>
      {/* TOP INFO */}
      <div className="px-4 py-4 space-y-4 ">
        {isLoading || !data ? (
          <StallDetailsSkeleton />
        ) : (
          <>
            <div>
              <h1 className="text-xl text-foreground font-semibold">
                {data?.name}
              </h1>
              <p className="text-sm text-muted-foreground">
                {data.category}{" "}
                {distance != null && <> • {formatDistance(distance)}</>}
              </p>

              <p className="text-sm text-subtle-foreground pt-2">
                {data.address}
              </p>
            </div>
            {/* Check-in Count */}
            <div className="text-sm text-secondary font-medium">
              🔥 {data.checkinCount} check-ins
            </div>
            {/* ACTION BUTTONS */}
            <div className="flex gap-3">
              <Button
                className="flex-1 bg-[#FF6B35] text-white"
                onClick={handleCheckIn}
                disabled={loading || isCheckingPending || !location}
              >
                {loading ? (
                  "Getting location..."
                ) : (
                  <>
                    <CircleCheck className="mr-2 h-4 w-4" />
                    Check In
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                className="flex-1 border-secondary/15 text-secondary"
                onClick={handleNavigate}
              >
                <Navigation className="mr-2 h-4 w-4" />
                Directions
              </Button>
            </div>
          </>
        )}
      </div>

      {/* SCROLLABLE CHECK-IN SECTION */}
      <div className="flex-1 overflow-y-auto px-4 pb-6 custom-scrollbar">
        <p className="text-sm font-medium text-gray-600 mb-3">
          Recent Check-ins
        </p>
        <div className="space-y-4">
          {isLoadingCheckinsActivity ? (
            <StallCheckinsSkeleton />
          ) : CheckinsActivity && CheckinsActivity.length > 0 ? (
            CheckinsActivity.map((checkin: recentCheckinCardProps) => (
              <RecentCheckinCard key={checkin._id} checkin={checkin} />
            ))
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              No checkins yet
            </div>
          )}
        </div>
      </div>
      {/* comment model */}
      <CommentModal
        open={showCommentModal}
        onClose={() => setShowCommentModal(false)}
        onSubmit={handleCommentSubmit}
      />
    </PageWrapper>
  );
}

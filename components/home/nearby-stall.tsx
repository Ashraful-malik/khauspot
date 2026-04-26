"use client";
import { Plus } from "lucide-react";
import StallCard from "../shared/stall-card";
import CardSkeleton from "../skelaton/CardSkeleton";
import { Button } from "../ui/button";
import HomeCTA from "./home-cta";
import Link from "next/link";
export default function NearByStall({ stalls, isLoading }: any) {
  return (
    <section
      aria-label="stalls near you"
      className="mt-6 mb-10 h-full overflow-y-auto"
    >
      {/* heading */}
      <h1 className="text-2xl font-bold">Popular Stalls Near You</h1>

      <div className="grid md:grid-cols-3 md:gap-3 gap-4 mt-8 md:mb-8 ">
        {stalls === null || isLoading ? (
          <CardSkeleton />
        ) : stalls?.length > 0 ? (
          stalls.map((stall: any) => (
            <StallCard key={stall._id} stall={stall} />
          ))
        ) : (
          <div className=" col-span-full text-center  mx-auto py-10 space-y-4">
            <p className="text-lg font-medium">No street food found here 🍜</p>

            <p className="text-sm text-muted-foreground max-w-xs ">
              Be the first to add a stall in this area or move the map to
              explore more.
            </p>

            <div className="flex gap-3">
              <Button asChild>
                <Link href="/add">
                  <Plus /> Add Stall
                </Link>
              </Button>

              <Button variant="outline" asChild>
                <Link href="/map">🗺️ Explore Nearby</Link>
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="hidden md:block">
        <HomeCTA />
      </div>
    </section>
  );
}

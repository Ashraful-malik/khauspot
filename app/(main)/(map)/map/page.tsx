"use client";
import StallMap from "@/components/map/StallMap";
import StallCard from "@/components/shared/stall-card";

export default function page() {
  return (
    <section className="h-full flex flex-col">
      {/* Map */}
      <div className=" h-[40%] ">
        <StallMap />
      </div>
      {/* LIST */}
      <div className="flex-1 px-3 py-4 overflow-y-auto mb-24 ">
        <h2 className="font-semibold text-md mb-3">Nearby Street Food</h2>
        <div className="flex flex-col gap-4">
          <StallCard checkins={12} distance={2} name="Ramesh Biryani" />
          <StallCard checkins={20} distance={1.2} name="Sharma Chaat" />
          <StallCard checkins={8} distance={0.5} name="Delhi Momos" />
          <StallCard checkins={8} distance={0.5} name="Delhi Momos" />
          <StallCard checkins={8} distance={0.5} name="Delhi Momos" />
          <StallCard checkins={8} distance={0.5} name="Delhi Momos" />
          <StallCard checkins={8} distance={0.5} name="Delhi Momos" />
        </div>
      </div>
    </section>
  );
}

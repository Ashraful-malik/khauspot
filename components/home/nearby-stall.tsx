"use client";
import StallCard from "../shared/stall-card";
import HomeCTA from "./home-cta";
export default function NearByStall() {
  return (
    <section
      aria-label="stalls near you"
      className="mt-6 mb-10 h-full overflow-y-auto"
    >
      {/* heading */}
      <h1 className="text-2xl font-bold">Popular Stalls Near You</h1>
      <div className="grid md:grid-cols-3 md:gap-3 gap-4 mt-8 md:mb-8 ">
        {/* nearby stall cards */}

        {[...Array(5)].map((_, i) => (
          <StallCard
            key={i}
            checkins={i * 2 + 1}
            distance={(i + 1) * 0.5}
            name={`Stall ${i + 1}`}
            category="Chaat"
          />
        ))}
      </div>
      <div className="hidden md:block">
        <HomeCTA />
      </div>
    </section>
  );
}

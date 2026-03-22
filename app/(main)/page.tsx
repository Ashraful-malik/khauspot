"use client";
import SearchInput from "@/components/forms/Search-Input";
import PageWrapper from "@/components/layout/PageWrapper";
import NearByStall from "@/components/home/nearby-stall";
import HomeCTA from "@/components/home/home-cta";

export default function Home() {
  return (
    <PageWrapper>
      {/* SEARCH */}
      <div className="shrink-0 bg-white z-10 ">
        <div className="max-w-6xl mx-auto px-4 py-2">
          <SearchInput />
        </div>
      </div>
      {/*  SCROLL AREA */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4">
          <NearByStall />
        </div>
      </div>

      <div className="shrink-0 bg-white  md:hidden ">
        <div className="flex-1 overflow-y-auto pb-24 px-4">
          <HomeCTA />
        </div>
      </div>
    </PageWrapper>
  );
}

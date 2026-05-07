import MapPage from "@/components/map/MapPage";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading map...</div>}>
      <MapPage />
    </Suspense>
  );
}

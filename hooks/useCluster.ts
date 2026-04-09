"use client";
import Supercluster from "supercluster";
import { useMemo } from "react";
import { BoundStalls, MapBounds } from "@/types/stalls";

type ClusterProperties = {
  cluster: boolean;
  point_count?: number;
  stall: BoundStalls;
};
type ClusterFeature = GeoJSON.Feature<GeoJSON.Point, ClusterProperties>;

// return type of hook

type useClusterReturn = {
  clusters: Supercluster.ClusterFeature<ClusterProperties>[];
  supercluster: Supercluster<ClusterProperties, ClusterProperties> | null;
};
export function useClusters(
  stalls: BoundStalls[],
  bounds: MapBounds | null,
  zoom: number,
): useClusterReturn {
  return useMemo(() => {
    if (!bounds || stalls.length === 0) {
      return {
        clusters: [],
        supercluster: null,
      };
    }

    // convert stalls- geojson point
    const points: ClusterFeature[] = stalls.map((stall) => ({
      type: "Feature",
      properties: {
        cluster: false,
        stall,
      },
      geometry: {
        type: "Point",
        coordinates: stall.location.coordinates,
      },
    }));
    const supercluster = new Supercluster<ClusterProperties, ClusterProperties>(
      {
        radius: 60,
        maxZoom: 16,
      },
    );
    supercluster.load(points);

    const clusters = supercluster.getClusters(
      [bounds.swLng, bounds.swLat, bounds.neLng, bounds.neLat],
      zoom,
    ) as Supercluster.ClusterFeature<ClusterProperties>[];

    return { clusters, supercluster };
  }, [stalls, bounds, zoom]);
}

"use client";
import { SetCoords } from "@/types/map";
import { MapBounds } from "@/types/stalls";
import { useEffect, useRef } from "react";
import { useMap, useMapEvents } from "react-leaflet";

type MapEventsProps = {
  setBounds: (b: MapBounds) => void;
  setZoom: (z: number) => void;
  setMapCenter: SetCoords;
  onMapMove?: () => void;
};
export function useMapEventsHandler({
  setBounds,
  setZoom,
  setMapCenter,
  onMapMove,
}: MapEventsProps) {
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoad = useRef(true);
  const map = useMap();
  useEffect(() => {
    const bound = map.getBounds();
    const ne = bound.getNorthEast();
    const sw = bound.getSouthWest();
    setBounds({
      neLat: ne.lat,
      neLng: ne.lng,
      swLat: sw.lat,
      swLng: sw.lng,
    });
    setZoom(map.getZoom());
    const center = map.getCenter();
    setMapCenter({
      lat: center.lat,
      lng: center.lng,
    });
  }, []);
  useMapEvents({
    moveend(e) {
      if (isInitialLoad.current) {
        isInitialLoad.current = false;
        return;
      }
      const map = e.target;
      const bounds = map.getBounds();
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();
      const center = map.getCenter();

      onMapMove?.(); //telling parent user move the map

      setBounds({
        neLat: ne.lat,
        neLng: ne.lng,
        swLat: sw.lat,
        swLng: sw.lng,
      });
      setZoom(map.getZoom());
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        setMapCenter({
          lat: center.lat,
          lng: center.lng,
        });
      }, 400);
    },
  });
  return null;
}

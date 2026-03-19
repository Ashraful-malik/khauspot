"use client";
import { useStalls } from "@/hooks/useStalls";
import { MapBounds } from "@/types/stalls";
import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;
type Stall = {
  _id: string;
  name: string;
  location: {
    coordinates: [number, number];
  };
};
function MapEvents({ setBounds }: { setBounds: (b: MapBounds) => void }) {
  useMapEvents({
    moveend(e) {
      console.log("movve", e);
      const map = e.target;
      const bounds = map.getBounds();
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();
      setBounds({
        neLat: ne.lat,
        neLng: ne.lng,
        swLat: sw.lat,
        swLng: sw.lng,
      });
    },
  });
  return null;
}
export default function StallMap() {
  const [bounds, setBounds] = useState<MapBounds | null>(null);
  const { data, isLoading } = useStalls(bounds);
  console.log("bounds", bounds);
  return (
    <MapContainer
      center={[12.9716, 77.5946]}
      zoom={15}
      className="w-full h-full"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapEvents setBounds={setBounds} />
      {data?.stalls?.map((stall: Stall) => {
        const [lng, lat] = stall.location.coordinates;
        return (
          <Marker key={stall._id} position={[lat, lng]}>
            <Popup>{stall.name}</Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

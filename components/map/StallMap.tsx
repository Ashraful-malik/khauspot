"use client";
import { useStalls } from "@/hooks/tanstack/useStalls";
import { MapBounds } from "@/types/stalls";
import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Circle,
} from "react-leaflet";
import L from "leaflet";
import { useClusters } from "@/hooks/useCluster";
import { SetCoords, StallMapProps } from "@/types/map";
import { useMapEventsHandler } from "@/hooks/useMapEventsHandler";

export default function StallMap({
  setMapCenter,
  nearbyCoords,
  shouldFly,
  onBoundsStallsChange,
  onMapMove,
  onMapReady,
}: StallMapProps) {
  const [bounds, setBounds] = useState<MapBounds | null>(null);
  const [zoom, setZoom] = useState(20);
  const { data: boundsStalls, isLoading } = useStalls(bounds);

  useEffect(() => {
    if (boundsStalls) {
      onBoundsStallsChange?.(boundsStalls.stalls);
    }
  }, [boundsStalls, onBoundsStallsChange]);

  const { clusters, supercluster } =
    useClusters(boundsStalls?.stalls || [], bounds, zoom) || {};

  return (
    <MapContainer
      center={[nearbyCoords?.lat || 20.5937, nearbyCoords?.lng || 78.9629]}
      zoom={15}
      className="w-full h-full"
      whenReady={() => onMapReady?.()}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* <MapReadyHandler onMapReady={onMapReady} /> */}

      {nearbyCoords?.lat && nearbyCoords?.lng && (
        <Circle
          center={[nearbyCoords.lat, nearbyCoords.lng]}
          radius={4000} // radius in meters
          pathOptions={{
            color: "#3b82f6", // border color
            fillColor: "#3b82f6", // fill color
            fillOpacity: 0.1, // transparency
            weight: 0,
          }}
        />
      )}
      <MapCenterUpdater
        lat={nearbyCoords?.lat}
        lng={nearbyCoords?.lng}
        shouldFly={shouldFly}
      />
      <MapEventsHandler
        setBounds={setBounds}
        setZoom={setZoom}
        setMapCenter={setMapCenter}
        onMapMove={onMapMove}
      />

      {clusters?.map((cluster: any) => {
        const { geometry, properties } = cluster;

        const [lng, lat] = geometry.coordinates;
        const isCluster = cluster.properties.cluster;
        if (isCluster) {
          const count = cluster.properties.point_count;
          return (
            <Marker
              key={`cluster-${cluster.id}`}
              position={[lat, lng]}
              eventHandlers={{
                click: (e) => {
                  L.DomEvent.stopPropagation(e);
                  if (!supercluster) return;

                  const expansionZoom = Math.min(
                    supercluster?.getClusterExpansionZoom(cluster.id) + 1,
                    18,
                  );
                  const map = e.target._map;
                  map.setView([lat, lng], expansionZoom);
                },
              }}
              icon={L.divIcon({
                html: `<div style="
                  background:#2563eb;
                  color:white;
                  border-radius:50%;
                  width:40px;
                  height:40px;
                  display:flex;
                  align-items:center;
                  justify-content:center;
                  font-weight:bold;
                ">${count}</div>`,
                className: "",
              })}
            />
          );
        }
        const stall = cluster.properties.stall;
        return (
          <Marker
            key={stall._id}
            position={[lat, lng]}
            eventHandlers={{
              click: (e) => {
                const map = e.target._map;
                const currentZoom = map.getZoom();
                map.flyTo([lat, lng], Math.max(currentZoom, 17), {
                  duration: 0.7,
                  // easeLinearity: 0.25,
                });
              },
            }}
          >
            <Popup>
              <div className="w-52 flex flex-col gap-2">
                <div className="text-sm font-semibold text-gray-900">
                  {stall.name}
                </div>

                {stall.category && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 w-fit">
                    {stall.category}
                  </span>
                )}

                <button className="text-xs text-blue-600 hover:underline text-left">
                  View details →
                </button>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
function MapEventsHandler(props: {
  setBounds: (b: MapBounds) => void;
  setZoom: (z: number) => void;
  setMapCenter: SetCoords;
  onMapMove?: () => void;
}) {
  useMapEventsHandler(props);
  return null;
}

function MapCenterUpdater({
  lat,
  lng,
  shouldFly,
}: {
  lat?: number;
  lng?: number;
  shouldFly?: boolean;
}) {
  const map = useMap();
  useEffect(() => {
    if (!lat || !lng || !shouldFly) return;
    map.flyTo([lat, lng], 15, { duration: 1 });
  }, [lat, lng, map, shouldFly]);

  return null;
}

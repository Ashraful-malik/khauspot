"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function MapView({ lat, lng }: { lat: number; lng: number }) {
  return (
    <MapContainer center={[lat, lng]} zoom={15} className="w-full h-full">
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]}>
        <Popup>
          📍 Selected Location <br />
          Lat: {lat}, Lng: {lng}
        </Popup>
      </Marker>
    </MapContainer>
  );
}

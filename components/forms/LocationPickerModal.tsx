"use client";
import { DEFAULT_LOCATION } from "@/app/(main)/(map)/map/page";
import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

type LocationPickerModalProps = {
  onClose: () => void;
  onSelect: (coords: { lat: number; lng: number }) => void;
};
function LocationPickerModal({ onClose, onSelect }: LocationPickerModalProps) {
  const userCoords = localStorage.getItem("userCoords");
  const userLatLng = JSON.parse(userCoords!);

  const [position, setPosition] = useState({
    lat: userLatLng.lat || DEFAULT_LOCATION.lat,
    lng: userLatLng.lng || DEFAULT_LOCATION.lng,
  });
  function MapClickHandler() {
    useMapEvents({
      click(e) {
        setPosition({
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        });
      },
    });
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
      <div className="bg-white w-full max-w-2xl h-125 rounded-lg flex flex-col">
        <div className="p-3 border-b flex justify-between">
          <p>Select Location</p>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="flex-1">
          <MapContainer
            center={[position.lat, position.lng]}
            zoom={15}
            className="h-full w-full"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapClickHandler />
            <Marker position={[position.lat, position.lng]} />
          </MapContainer>
        </div>

        <div className="p-3 border-t flex justify-end">
          <button
            className="bg-blue-600 text-white px-4 py-1 rounded"
            onClick={() => onSelect(position)}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default LocationPickerModal;

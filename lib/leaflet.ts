"use client";
import "leaflet/dist/leaflet.css";

import { useEffect } from "react";

export default function LeafletSetup() {
  useEffect(() => {
    const L = require("leaflet");

    const markerIcon = require("leaflet/dist/images/marker-icon.png");
    const markerShadow = require("leaflet/dist/images/marker-shadow.png");

    const stallIcon = L.icon({
      iconUrl: "/icons/stall.svg",
      iconSize: [45, 45],
      iconAnchor: [19, 38],
    });

    L.Marker.prototype.options.icon = stallIcon;
  }, []);

  return null;
}
// marker default icon

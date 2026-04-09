export function calculateDistance(
  coord1: { lat: number; lng: number },
  coord2: { lat: number; lng: number },
) {
  const R = 6371; // Radius of the earth in km
  const dLat = toRad(coord2.lat - coord1.lat);
  const dLng = toRad(coord2.lng - coord1.lng);

  const lat1 = toRad(coord1.lat);
  const lat2 = toRad(coord2.lat); // ✅ FIXED
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // distance in km
}
export function toRad(value: number) {
  return (value * Math.PI) / 180;
}

export function formatDistance(distance: number | null) {
  if (!distance) return null;

  if (distance < 0.05) return "Very close";
  if (distance < 0.5) return `${Math.round(distance * 1000)} m away`;
  if (distance < 5) return `${distance.toFixed(1)} km away`;

  return `${Math.round(distance)} km away`;
}

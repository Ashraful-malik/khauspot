// types/map.ts
export type Coords = {
  lat: number;
  lng: number;
};

export type SetCoords = React.Dispatch<React.SetStateAction<Coords | null>>;
export type StallMapProps = {
  setMapCenter: React.Dispatch<React.SetStateAction<Coords | null>>;
  nearbyCoords: {
    lat?: number;
    lng?: number;
  };
  shouldFly?: boolean;
  onBoundsStallsChange?: (data: any) => void;
  onMapMove?: () => void;
  onMapReady?: () => void;
};

export type MapBounds = {
  neLat: number;
  neLng: number;
  swLat: number;
  swLng: number;
};

export type BoundStalls = {
  _id: string;
  name: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  averageRating?: number;
  totalReviews?: number;
  isVerified?: boolean;
};

export type StallsResponse = {
  stalls: BoundStalls[];
};

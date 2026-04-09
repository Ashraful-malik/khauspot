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

export type Stall = {
  _id: string;
  name: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  category: string;
  averageRating?: number;
  totalReviews?: number;
  checkinCount?: number; //
  isVerified?: boolean;
  photos: {
    url: string;
    publicId: string;
  }[];
  createdBy: {
    _id: string;
    name: string;
    avatar: string;
  };
  createdAt: string;
  updatedAt: string;
};

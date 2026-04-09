import connectDb from "@/lib/db";
import Stall from "@/models/Stall";
import { NextRequest, NextResponse } from "next/server";

// get nearby stalls
export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const { searchParams } = new URL(req.url);
    const lat = parseFloat(searchParams.get("lat") || "");
    const lng = parseFloat(searchParams.get("lng") || "");
    // const radius = parseInt(searchParams.get("radius") || "500");
    console.log(lat, lng);

    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json(
        { error: "Invalid coordinates" },
        { status: 400 },
      );
    }

    const stalls = await Stall.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [lng, lat],
          },
          distanceField: "distance",
          distanceMultiplier: 0.001, //meters->1km
          maxDistance: 4000,
          spherical: true,
          query: {
            isRemoved: false,
          },
        },
      },
      {
        $project: {
          name: 1,
          location: 1,
          category: 1,
          averageRating: 1,
          totalReviews: 1,
          isVerified: 1,
          checkinCount: 1,
          distance: 1, // 👈 include distance
        },
      },
      { $limit: 20 },
    ]);

    return NextResponse.json(stalls, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

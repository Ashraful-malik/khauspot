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
    const radius = parseInt(searchParams.get("radius") || "500");

    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json(
        { error: "Invalid coordinates" },
        { status: 400 },
      );
    }

    const stalls = await Stall.find({
      isRemoved: false,
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
          $maxDistance: radius,
        },
      },
    })
      .select(
        "name location category averageRating totalReviews isVerified checkinCount",
      )
      .limit(50)
      .lean();

    return NextResponse.json(stalls, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

import connectDb from "@/lib/db";
import TeaStall from "@/models/TeaStall";
import User from "@/models/User";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createStallSchema } from "@/lib/validators/stall.validator";
import { validateBody } from "@/lib/validate";
import { rateLimit } from "@/lib/ratelimit";

// Create Add stalls
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      await rateLimit(userId, "createStall", 5, 3600); // 5 requests per hour
    } catch (error) {
      return NextResponse.json(
        { error: "Too many stalls created. Try later." },
        { status: 429 },
      );
    }

    await connectDb();

    const data = await validateBody(req, createStallSchema);

    const { name, coordinates, address, photos } = data;
    const [lng, lat] = coordinates;

    if (typeof lng !== "number" || typeof lat !== "number") {
      return NextResponse.json(
        { error: "Invalid coordinates format" },
        { status: 400 },
      );
    }
    // duplicate detection
    const existingStall = await TeaStall.findOne({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
          $maxDistance: 30, //meter
        },
      },
    });

    if (existingStall) {
      return NextResponse.json(
        { error: "Tea stall already exist nearby" },
        { status: 409 },
      );
    }

    const localUser = await User.findOne({ clerkId: userId });

    if (!localUser || localUser.isDeleted) {
      return NextResponse.json(
        {
          error: "User not active",
        },
        { status: 404 },
      );
    }

    // create stall
    const newStall = await TeaStall.create({
      name,
      location: {
        type: "Point",
        coordinates: [lng, lat],
      },
      address,
      createdBy: localUser._id,
      photos,
    });

    return NextResponse.json(newStall, { status: 201 });
  } catch (error) {
    console.error("Crete Stall Error", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// get all stalls under (Bounding box api)
export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const { searchParams } = new URL(req.url);
    const neLat = parseFloat(searchParams.get("neLat") || "");
    const neLng = parseFloat(searchParams.get("neLng") || "");
    const swLat = parseFloat(searchParams.get("swLat") || "");
    const swLng = parseFloat(searchParams.get("swLng") || "");

    if (isNaN(neLat) || isNaN(neLng) || isNaN(swLat) || isNaN(swLng)) {
      return NextResponse.json(
        { error: "Invalid bounding box coordinates" },
        { status: 400 },
      );
    }

    const stalls = await TeaStall.find({
      isRemoved: false,
      location: {
        $geoWithin: {
          $box: [
            [swLng, swLat], //bottom left
            [neLng, neLat], // top right
          ],
        },
      },
    })
      .select("name location averageRating totalReviews isVerified")
      .limit(100)
      .lean();
    return NextResponse.json({ stalls }, { status: 200 });
  } catch (error) {
    console.error("Get All Stalls Error", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

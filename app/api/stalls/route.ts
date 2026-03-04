import connectDb from "@/lib/db";
import TeaStall from "@/models/TeaStall";
import User from "@/models/User";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Add stalls
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDb();
    const body = await req.json();
    const { name, coordinates, address, photos } = body;
    console.log(body);

    if (!name || !coordinates || coordinates.length !== 2) {
      return NextResponse.json(
        { error: "Invalid name or coordinates" },
        { status: 400 },
      );
    }
    if (!photos || photos.length === 0) {
      return NextResponse.json(
        { error: "At least one photo is required" },
        { status: 400 },
      );
    }
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
    if (!localUser || !localUser.isDeleted) {
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
    const newLat = parseInt(searchParams.get("newLat") || "");
    const newLng = parseInt(searchParams.get("newLng") || "");
    const swLat = parseInt(searchParams.get("swLat") || "");
    const swLng = parseInt(searchParams.get("swLng") || "");

    if (isNaN(newLat) || isNaN(newLng) || isNaN(swLat) || isNaN(swLng)) {
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
            [newLng, newLat], // top right
          ],
        },
      },
    })
      .select("name location averageRating totalReviews isVerified")
      .limit(100);
    return NextResponse.json(stalls, { status: 200 });
  } catch (error) {
    console.error("Get All Stalls Error", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

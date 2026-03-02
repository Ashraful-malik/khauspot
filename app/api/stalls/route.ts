import connectDb from "@/lib/db";
import TeaStall from "@/models/TeaStall";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Add stalls
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    console.log(userId);
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

    // create stall
    const newStall = await TeaStall.create({
      name,
      location: {
        type: "Point",
        coordinates: [lng, lat],
      },
      address,
      createdBy: userId,
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

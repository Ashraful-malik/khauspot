import connectDb from "@/lib/db";
import { rateLimit } from "@/lib/ratelimit";
import { validateBody } from "@/lib/validate";
import { createCheckInSchema } from "@/lib/validators/checkIn.validator";
import Checkin from "@/models/CheckIns";
import Stall from "@/models/Stall";
import User from "@/models/User";
import { auth } from "@clerk/nextjs/server";
import { MongoServerError } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { stallId: string } },
) {
  try {
    const BAD_ACCURACY = 30;
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // rate limit
    try {
      await rateLimit(userId, "createCheckIn", 20, 86400); //20 request perday
    } catch (error) {
      return NextResponse.json(
        { error: "Too many check-ins created. Try later." },
        { status: 429 },
      );
    }

    await connectDb();
    const { stallId } = await params;
    const data = await validateBody(req, createCheckInSchema);
    const { coordinates, comment, accuracy } = data;
    const [lng, lat] = coordinates;

    if (accuracy > BAD_ACCURACY) {
      return NextResponse.json(
        { error: "Location accuracy too low. Please enable GPS." },
        { status: 400 },
      );
    }
    const user = await User.findOne({ clerkId: userId });
    if (!user || user.isDeleted) {
      return NextResponse.json({ error: "User not active " }, { status: 403 });
    }

    // check distance (must be within 50meters)
    const stall = await Stall.findOne({
      _id: stallId,
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
          $maxDistance: 50, //in 50 meters
        },
      },
    });

    if (!stall) {
      return NextResponse.json(
        { error: "Stall not found or you are too far from the stall" },
        { status: 403 },
      );
    }

    // prevent multiple checkins per day

    // create check-in
    await Checkin.create({
      stallId,
      userId: user._id,
      comment: comment,
      location: {
        type: "Point",
        coordinates: [lng, lat],
      },
      day: new Date().toISOString().slice(0, 10),
    });

    // increment counter automatically
    await Stall.findByIdAndUpdate(stall._id, {
      $inc: {
        checkinCount: 1,
        verificationScore: 1,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Check-in successful",
    });
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof MongoServerError && error.code === 11000) {
      return NextResponse.json(
        { error: "Already checked in today" },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

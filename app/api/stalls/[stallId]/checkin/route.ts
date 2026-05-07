import connectDb from "@/lib/db";
import { rateLimit } from "@/lib/ratelimit";
import { validateBody } from "@/lib/validate";
import { createCheckInSchema } from "@/lib/validators/checkIn.validator";
import Checkin from "@/models/CheckIns";
import Stall from "@/models/Stall";
import User from "@/models/User";
import { auth } from "@clerk/nextjs/server";
import { MongoServerError } from "mongodb";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// Create Checkin
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
    console.log(data);
    const { coordinates, accuracy } = data;
    const [lat, lng] = coordinates;
    console.log("coordinates", coordinates);

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
        { error: "You are too far from the stall to check in" },
        { status: 403 },
      );
    }

    // prevent multiple checkins per day

    // create check-in
    const checkin = await Checkin.create({
      stallId,
      userId: user._id,
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

    return NextResponse.json(
      { data: { id: checkin._id } },

      {
        status: 201,
      },
    );
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

// get checkins of a particular stall
export async function GET(
  req: NextRequest,
  { params }: { params: { stallId: string } },
) {
  try {
    await connectDb();
    const { stallId } = await params;
    if (!mongoose.Types.ObjectId.isValid(stallId)) {
      return NextResponse.json({ error: "Invalid stall id" }, { status: 400 });
    }
    const stallObjectId = new mongoose.Types.ObjectId(stallId);

    const stallExists = await Stall.exists({ _id: stallObjectId });
    if (!stallExists) {
      return NextResponse.json({ error: "Stall not found" }, { status: 404 });
    }

    const checkins = await Checkin.aggregate([
      { $match: { stallId: stallObjectId } },
      { $sort: { createdAt: -1 } },

      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },

      { $unwind: "$user" },
      {
        $project: {
          type: { $literal: "checkin" },
          createdAt: 1,
          "user.name": 1,
          "user.avatar": 1,
          comment: 1,
        },
      },
    ]);
    console.log(checkins);
    return NextResponse.json({ checkins }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

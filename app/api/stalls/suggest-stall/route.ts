import connectDb from "@/lib/db";
import { validateBody } from "@/lib/validate";
import { suggestedStallSchema } from "@/lib/validators/suggestStall.validator";
import Stall from "@/models/Stall";
import SuggestedStall from "@/models/SuggestedStall";
import User from "@/models/User";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Suggest stall (suggested by user)
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await validateBody(req, suggestedStallSchema);
    const { name, category, coordinates, photos, address } = body;
    const [lat, lng] = coordinates;
    console.log("coordinates from backend", coordinates);
    await connectDb();

    const user = await User.findOne({ clerkId: userId });

    if (!user || user.isDeleted) {
      return NextResponse.json({ error: "User not active" }, { status: 404 });
    }

    //check duplicate existing
    const existingStall = await Stall.findOne({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
          $maxDistance: 30,
        },
      },
    });
    if (existingStall) {
      return NextResponse.json(
        {
          type: "duplicate_stall",
          message: "This stall already exists nearby",
          stall: {
            id: existingStall._id,
            name: existingStall.name,
            category: existingStall.category,
            location: existingStall.location,
          },
        },
        { status: 409 },
      );
    }

    // check duplication pending suggestion in suggestedStall
    const existingSuggestion = await SuggestedStall.findOne({
      status: "pending",
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [lng, lat] },
          $maxDistance: 30,
        },
      },
    });

    if (existingSuggestion) {
      return NextResponse.json(
        {
          type: "duplicate_suggestion",
          message:
            "A stall suggestion for this location is already in pending for approval",
        },
        { status: 409 },
      );
    }
    // Rate limit suggestions per user per day
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const suggestionsToday = await SuggestedStall.countDocuments({
      suggestedBy: user._id,
      createdAt: { $gte: startOfDay },
    });

    if (suggestionsToday >= 10) {
      return NextResponse.json(
        { error: "Daily suggestion limit reached" },
        { status: 429 },
      );
    }

    await SuggestedStall.create({
      name,
      category,
      location: {
        type: "Point",
        coordinates: [lng, lat],
      },
      photos: photos ?? [],
      suggestedBy: user._id,
      status: "pending",
      address,
    });
    return NextResponse.json(
      { message: "Suggestion submitted" },
      { status: 201 },
    );
  } catch (error) {
    console.error("suggest stall error", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

import connectDb from "@/lib/db";
import { getGeoAddress } from "@/lib/getGeoAddress";
import Stall from "@/models/Stall";
import SuggestedStall from "@/models/SuggestedStall";
import User from "@/models/User";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Approve stall
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);
    const role = clerkUser.publicMetadata.role;

    if (role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDb();
    const body = await req.json();
    const { stallId } = body;
    if (!stallId) {
      return NextResponse.json(
        { error: "Missing suggestion id" },
        { status: 400 },
      );
    }

    const user = await User.findOne({ clerkId: userId });
    if (!user || user.isDeleted) {
      return NextResponse.json({ error: "User not active" }, { status: 404 });
    }

    const userSuggestedStalls = await SuggestedStall.findById(stallId);

    if (!userSuggestedStalls || userSuggestedStalls.status !== "pending") {
      return NextResponse.json(
        { error: "suggestion not found or already approved" },
        { status: 404 },
      );
    }
    const [lng, lat] = userSuggestedStalls.location.coordinates;
    const address = await getGeoAddress(lat, lng);

    await Stall.create({
      name: userSuggestedStalls.name,
      category: userSuggestedStalls.category,
      location: userSuggestedStalls.location,
      photos: userSuggestedStalls.photos || [],
      address: address,
      createdBy: userSuggestedStalls.suggestedBy,
    });
    userSuggestedStalls.status = "approved";
    userSuggestedStalls.reviewedBy = user._id;
    userSuggestedStalls.reviewedAt = new Date();

    await userSuggestedStalls.save();
    return NextResponse.json(
      { message: "stall approved successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

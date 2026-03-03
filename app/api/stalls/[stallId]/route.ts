import connectDb from "@/lib/db";
import TeaStall from "@/models/TeaStall";
import User from "@/models/User";
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { stallId: string } },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { stallId } = await params;
    if (!mongoose.Types.ObjectId.isValid(stallId)) {
      return NextResponse.json({ error: "Invalid stall id" }, { status: 400 });
    }
    await connectDb();

    const localUser = await User.findById(userId);
    if (!localUser || localUser.isDeleted) {
      return NextResponse.json({ error: "User not active " }, { status: 403 });
    }

    const stall = await TeaStall.findById(stallId);
    if (!stall || !stall.isRemoved) {
      return NextResponse.json({ error: "Stall not found" }, { status: 404 });
    }

    // Authorization check
    if (!stall.createdBy.equals(localUser._id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Restriction rule
    if (stall.isVerified || stall.totalReviews >= 3) {
      return NextResponse.json(
        { error: "Verified or community-reviewed stalls cannot be edited" },
        { status: 403 },
      );
    }

    const body = await req.json();
    const { name, address } = body;
    if (name) stall.name = name.trim();
    if (address) stall.address = address.trim();

    await stall.save();
    return NextResponse.json(
      { message: "Stall updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating stall:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

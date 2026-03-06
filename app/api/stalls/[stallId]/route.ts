import connectDb from "@/lib/db";
import { validateBody } from "@/lib/validate";
import { updateStallSchema } from "@/lib/validators/stall.validator";
import TeaStall from "@/models/TeaStall";
import User from "@/models/User";
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// Get Tea stall Details
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
    const stall = await TeaStall.findById(stallId)
      .populate("createdBy", "name avatar")
      .select(
        "name address location averageRating totalReviews isVerified createdBy createdAt",
      )
      .lean();

    if (!stall || stall.isRemoved) {
      return NextResponse.json({ error: "Stall not found" }, { status: 404 });
    }
    return NextResponse.json({ stall });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Update Stall Details
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

    const localUser = await User.findOne({ clerkId: userId });

    if (!localUser || localUser.isDeleted) {
      return NextResponse.json({ error: "User not active " }, { status: 403 });
    }

    const stall = await TeaStall.findById(stallId);

    if (!stall || stall.isRemoved) {
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

    const data = await validateBody(req, updateStallSchema);
    const { name, address } = data;

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

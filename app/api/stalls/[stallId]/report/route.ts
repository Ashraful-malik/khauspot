import connectDb from "@/lib/db";
import StallReport from "@/models/StallReport";
import TeaStall from "@/models/TeaStall";
import User from "@/models/User";
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { MongoServerError } from "mongodb";

// Report Stall and soft delete
export async function POST(
  req: NextRequest,
  { params }: { params: { stallId: string } },
) {
  try {
    const REPORT_COUNT = 3;
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(params.stallId)) {
      return NextResponse.json({ error: "Invalid Stall ID" }, { status: 400 });
    }

    await connectDb();
    const { stallId } = await params;
    const localUser = await User.findOne({ clerkId: userId });

    if (!localUser || localUser.isDeleted) {
      return NextResponse.json({ error: "User not active" }, { status: 403 });
    }

    const stall = await TeaStall.findById(stallId);
    if (!stall || stall.isRemoved) {
      return NextResponse.json({ error: "Stall not found" }, { status: 404 });
    }

    // prevent self report
    if (stall.createdBy.equals(localUser._id)) {
      return NextResponse.json(
        { error: "You cannot report your own stall" },
        { status: 403 },
      );
    }
    const body = await req.json();
    const { reason } = body;
    await StallReport.create({
      stall: stall._id,
      user: localUser._id,
      reason,
    });

    // increase report count
    stall.reportCount += 1;

    // auto hide if >=3 reports
    if (stall.reportCount >= REPORT_COUNT) {
      stall.isRemoved = true;
    }
    await stall.save();
    return NextResponse.json({ message: "Report submitted" }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof MongoServerError && error.code === 11000) {
      return NextResponse.json(
        { error: "You have already reported this stall" },
        { status: 400 },
      );
    }
    console.error("Report stall Error", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

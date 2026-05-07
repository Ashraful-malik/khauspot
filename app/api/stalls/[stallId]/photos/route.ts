import connectDb from "@/lib/db";
import Stall from "@/models/Stall";
import { StallParams } from "@/types/api";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// Get Stall Photos
export async function GET(
  req: NextRequest,
  { params }: { params: StallParams },
) {
  try {
    await connectDb();
    const { stallId } = await params;
    if (!mongoose.Types.ObjectId.isValid(stallId)) {
      return NextResponse.json({ error: "Invalid stall id" }, { status: 400 });
    }

    const stall = await Stall.findById(stallId).select("photos").lean();
    if (!stall) {
      return NextResponse.json({ error: "Stall not found" }, { status: 404 });
    }
    return NextResponse.json(
      {
        photos: stall.photos || [],
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

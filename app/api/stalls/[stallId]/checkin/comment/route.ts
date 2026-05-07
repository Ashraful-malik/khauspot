import connectDb from "@/lib/db";
import Checkin from "@/models/CheckIns";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDb();

    const { comment, checkinId } = await req.json();

    if (!checkinId) {
      return NextResponse.json(
        { error: "Checkin ID is required" },
        { status: 400 },
      );
    }
    if (!comment?.trim()) {
      return NextResponse.json({ error: "Empty comment" }, { status: 400 });
    }

    const checkin = await Checkin.findByIdAndUpdate(
      checkinId,
      { comment },
      { new: true },
    );

    if (!checkin) {
      return NextResponse.json({ error: "Checkin not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

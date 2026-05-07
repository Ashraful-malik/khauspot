import connectDb from "@/lib/db";
import SuggestedStall from "@/models/SuggestedStall";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Reject stall suggestion
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
    const { stallId, adminNote } = body;

    if (!stallId) {
      return NextResponse.json(
        { error: "Suggestion ID required" },
        { status: 400 },
      );
    }

    const rejectedStall = await SuggestedStall.findOneAndUpdate(
      {
        _id: stallId,
        status: "pending",
      },
      {
        status: "rejected",
        ...(adminNote && { adminComment: adminNote }),
      },
      { new: true },
    );

    if (!rejectedStall) {
      return NextResponse.json(
        { error: "Stall not found or already processed" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Rejected stall" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}

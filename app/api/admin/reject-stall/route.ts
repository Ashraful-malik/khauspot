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
    const { suggestionId, adminNote } = body;
    if (!suggestionId) {
      return NextResponse.json(
        { error: "Missing suggestion id" },
        { status: 400 },
      );
    }

    const userSuggestedStalls = await SuggestedStall.findById(suggestionId);
    if (!userSuggestedStalls) {
      return NextResponse.json({ error: "Stall not found" }, { status: 404 });
    }
    userSuggestedStalls.status = "rejected";
    userSuggestedStalls.adminComment = adminNote;
    userSuggestedStalls.save();
    return NextResponse.json(
      { message: "Rejected successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("error while stall rejection");
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}

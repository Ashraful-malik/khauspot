import connectDb from "@/lib/db";
import Stall from "@/models/Stall";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Delete a stall
export async function DELETE(req: NextRequest) {
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
    const body = await req.json();
    const { stallId } = body;
    if (!stallId) {
      return NextResponse.json({ error: "Missing stall id" }, { status: 400 });
    }
    await connectDb();
    const stall = await Stall.findById(stallId);
    if (!stall || stall.isRemoved) {
      return NextResponse.json(
        { error: "stall nor found or stall is already removed" },
        { status: 404 },
      );
    }
    stall.isRemoved = true;
    await stall.save();

    return NextResponse.json(
      { message: "Stall removed successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("error while deleting stall", error);
    return NextResponse.json(
      { error: "Internal serverError" },
      { status: 500 },
    );
  }
}

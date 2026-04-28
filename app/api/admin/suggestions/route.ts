import connectDb from "@/lib/db";
import SuggestedStall from "@/models/SuggestedStall";
import User from "@/models/User";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Get all pending stalls suggestions
export async function GET(req: NextResponse) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);
    const role = clerkUser.publicMetadata.role;
    console.log("Role from clerk api=> ", role);

    if (role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDb();
    const user = await User.findOne({ clerkId: userId });
    if (!user || user.isDeleted) {
      return NextResponse.json({ error: "User not active" }, { status: 404 });
    }

    const suggestions = await SuggestedStall.find({
      status: "pending",
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalSuggestions = await SuggestedStall.countDocuments({
      status: "pending",
    });
    return NextResponse.json(
      {
        suggestions,
        pagination: {
          total: totalSuggestions,
          page,
          limit,
          pages: Math.ceil(totalSuggestions / limit),
        },
      },

      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

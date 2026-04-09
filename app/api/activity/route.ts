import connectDb from "@/lib/db";
import { getClientIp } from "@/lib/getClientIp";
import { rateLimit } from "@/lib/ratelimit";
import Checkin from "@/models/CheckIns";
import SuggestedStall from "@/models/SuggestedStall";
import { NextRequest, NextResponse } from "next/server";

// Get Recent Activity
export async function GET(req: NextRequest) {
  try {
    try {
      const ip = getClientIp(req);
      await rateLimit(ip, "activity", 20, 10);
    } catch (error) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
    await connectDb();
    const checkins = await Checkin.aggregate([
      { $sort: { createdAt: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $lookup: {
          from: "stalls",
          localField: "stallId",
          foreignField: "_id",
          as: "stall",
        },
      },
      { $unwind: "$user" },
      { $unwind: "$stall" },
      {
        $project: {
          type: { $literal: "checkin" },
          createdAt: 1,
          "user.name": 1,
          "user.avatar": 1,
          "stall.name": 1,
        },
      },
    ]);
    const suggestions = await SuggestedStall.aggregate([
      { $sort: { createdAt: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "suggestedBy",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          type: { $literal: "suggestion" },
          createdAt: 1,
          stallName: "$name",
          user: {
            name: "$user.name",
            avatar: "$user.avatar",
          },
        },
      },
    ]);

    const activity = [...checkins, ...suggestions];
    activity.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return NextResponse.json(activity.slice(0, 20), { status: 200 });
  } catch (error) {
    console.log("error while fetching activity", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

import connectDb from "@/lib/db";
import recalculateStallStats from "@/lib/recalculateStallStats";
import Review from "@/models/Review";
import TeaStall from "@/models/TeaStall";
import User from "@/models/User";
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { MongoServerError } from "mongodb";
import { reviewsSchema } from "@/lib/validators/review.validator";
import { validateBody } from "@/lib/validate";

// Add Review
export async function POST(
  req: Request,
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
    const stall = await TeaStall.findById(stallId);
    if (!stall) {
      return NextResponse.json({ error: "Stall not found" }, { status: 404 });
    }
    const data = await validateBody(req, reviewsSchema);
    const { rating, text, photos } = data;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 },
      );
    }
    const localUser = await User.findOne({ clerkId: userId });

    if (!localUser || !localUser.isDeleted) {
      return NextResponse.json(
        {
          error: "User not active",
        },
        { status: 404 },
      );
    }

    // create review
    await Review.create({
      stallId,
      user: localUser._id,
      rating,
      text,
      photos,
    });

    //  Recalculate stall stats
    await recalculateStallStats(stallId);

    return NextResponse.json(
      {
        message: "Review added successfully",
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    if (error instanceof MongoServerError && error.code === 11000) {
      return NextResponse.json(
        { error: "You already reviewed this stall" },
        { status: 409 },
      );
    }
    console.error("Review Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// Get Reviews
export async function GET(
  req: NextRequest,
  { params }: { params: { stallId: string } },
) {
  try {
    const { stallId } = await params;

    if (!mongoose.Types.ObjectId.isValid(stallId)) {
      return NextResponse.json({ error: "Invalid stall id" }, { status: 400 });
    }
    await connectDb();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "5");
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ stallId })
      .populate("user", "name avatar isDeleted")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalReviews = await Review.countDocuments({ stallId });

    return NextResponse.json({
      reviews,
      pagination: {
        total: totalReviews,
        page,
        limit,
        pages: Math.ceil(totalReviews / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

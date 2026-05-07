import connectDb from "@/lib/db";
import recalculateStallStats from "@/lib/recalculateStallStats";
import Review from "@/models/Review";
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// Update Review
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ stallId: string; reviewId: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDb();
    const { rating, text, photos } = await req.json();

    const { reviewId, stallId } = await params;

    if (
      !mongoose.Types.ObjectId.isValid(reviewId) ||
      !mongoose.Types.ObjectId.isValid(stallId)
    ) {
      return NextResponse.json(
        { error: "Review ID and Stall ID are required" },
        { status: 400 },
      );
    }

    const review = await Review.findById(reviewId);

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    if (review.user !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    review.rating = rating ?? review.rating;
    review.text = text ?? review.text;
    review.photos = photos ?? review.photos;

    await review.save();
    await recalculateStallStats(stallId);

    return NextResponse.json({ message: "Review updated" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Delete Review
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ reviewId: string; stallId: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDb();
    const { reviewId, stallId } = await params;

    const review = await Review.findById(reviewId);
    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    if (review.user !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    await review.deleteOne();
    await recalculateStallStats(stallId);
    return NextResponse.json({ message: "Review deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

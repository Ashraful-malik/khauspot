import connectDb from "@/lib/db";
import Review from "@/models/Review";
import TeaStall from "@/models/TeaStall";
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { stallId: string } },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { stallId } = params;
    if (!mongoose.Types.ObjectId.isValid(stallId)) {
      return NextResponse.json({ error: "Invalid stall id" }, { status: 400 });
    }

    await connectDb();
    const stall = await TeaStall.findById(stallId);
    if (!stall) {
      return NextResponse.json({ error: "Stall not found" }, { status: 404 });
    }
    const body = await req.json();
    const { rating, text, photos } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 },
      );
    }

    // create review
    const review = await Review.create({
      stallId,
      userId,
      rating,
      text,
      photos,
    });

    //  Recalculate stall stats

    const stats = await Review.aggregate([
      { $match: { stallId: new mongoose.Types.ObjectId(stallId) } },
      {
        $group: {
          _id: "$stallId",
          avgRating: { $avg: "$rating" },
          total: { $sum: 1 },
        },
      },
    ]);
    const avgRating = stats[0]?.avgRating || 0;
    const totalReviews = stats[0]?.total || 0;

    // verification logic
    let verificationScore = avgRating * totalReviews;
    let isVerified = false;
    if (totalReviews >= 3 || verificationScore >= 5) {
      isVerified = true;
    }
    await TeaStall.findByIdAndUpdate(stallId, {
      averageRating: avgRating,
      verificationScore,
      isVerified,
      totalReviews,
    });
    return NextResponse.json(
      {
        message: "Review added successfully",
      },
      { status: 201 },
    );
  } catch (error: any) {
    if (error.code === 11000) {
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

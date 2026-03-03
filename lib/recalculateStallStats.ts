import mongoose from "mongoose";
import Review from "@/models/Review";
import TeaStall from "@/models/TeaStall";

export default async function recalculateStallStats(stallId: string) {
  const TOTAL_REVIEWS_THRESHOLD = 3;
  const VERIFICATION_SCORE_THRESHOLD = 5;
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

  let verificationScore = avgRating * totalReviews;
  let isVerified =
    totalReviews >= TOTAL_REVIEWS_THRESHOLD ||
    verificationScore >= VERIFICATION_SCORE_THRESHOLD;

  await TeaStall.findByIdAndUpdate(stallId, {
    averageRating: avgRating,
    verificationScore,
    isVerified,
    totalReviews,
  });
}

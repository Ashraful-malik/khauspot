import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema(
  {
    stallId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeaStall",
      required: true,
    },
    userId: {
      type: String, // Clerk userId
      required: true,
    },
    photos: [
      {
        url: String,
        publicId: String,
      },
    ],
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    text: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);
reviewSchema.index({ stallId: 1, userId: 1 }, { unique: true });
const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);

export default Review;

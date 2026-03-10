import mongoose, { Schema } from "mongoose";
import TeaStall from "./Stall";

const reviewSchema = new Schema(
  {
    stallId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeaStall",
      required: true,
    },
    user: {
      type: String,
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

reviewSchema.index({ stallId: 1, createdAt: -1 });
reviewSchema.index({ stallId: 1, user: 1 }, { unique: true });
const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);

export default Review;

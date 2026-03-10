import mongoose, { Schema } from "mongoose";
const suggestedStallSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        "chai",
        "chaat",
        "momos",
        "samosa_snacks",
        "noodles_maggi",
        "regional_food",
        "juice_lassi",
        "sweets_desserts",
        "other",
      ],
      default: "other",
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },

    photos: [
      {
        url: String,
        publicId: String,
      },
    ],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    suggestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    adminComment: {
      type: String,
    },
    reviewAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);
suggestedStallSchema.index({ location: "2dsphere" });
suggestedStallSchema.index({ status: 1 });

export default mongoose.models.SuggestedStall ||
  mongoose.model("SuggestedStall", suggestedStallSchema);

import mongoose, { Schema } from "mongoose";

const teaStallSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },

    address: {
      type: String,
    },

    verificationScore: {
      type: Number,
      default: 0,
    },
    photos: [
      {
        url: String,
        publicId: String,
      },
    ],

    isVerified: {
      type: Boolean,
      default: false,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },

    createdBy: {
      type: String, // Clerk userId
      required: true,
    },

    duplicateOf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeaStall",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);
teaStallSchema.index({ location: "2dsphere" });
teaStallSchema.index({ createdBy: 1 });

const TeaStall =
  mongoose.models.TeaStall || mongoose.model("TeaStall", teaStallSchema);

export default TeaStall;

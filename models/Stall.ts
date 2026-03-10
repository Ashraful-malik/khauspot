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
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isRemoved: {
      type: Boolean,
      default: false,
    },

    checkinCount: {
      type: Number,
      default: 0,
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
      required: true,
    },

    reportCount: {
      type: Number,
      default: 0,
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
teaStallSchema.index({ isRemoved: 1 });

const Stall = mongoose.models.Stall || mongoose.model("Stall", teaStallSchema); //TODO: LATED REMOVE TeaStall adn replace with Stall

export default Stall;

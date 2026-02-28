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
        enum: ["point"],
        require: true,
      },
      coordinates: {
        type: [Number],
        require: true,
      },
    },

    address: {
      type: String,
    },

    verificationScore: {
      type: Number,
      default: 0,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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

const TeaStall =
  mongoose.models.TeaStall || mongoose.model("TeaStall", teaStallSchema);

export default TeaStall;

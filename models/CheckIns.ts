import mongoose, { Schema } from "mongoose";
const checkInSchema = new Schema(
  {
    stallId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stall",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comment: {
      type: String,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: [Number],
    },
    day: {
      type: Date,
      required: true,
    },
  },

  { timestamps: true },
);

checkInSchema.index({ stallId: 1, userId: 1, day: 1 }, { unique: true });
checkInSchema.index({ location: "2dsphere" });
// checkInSchema.index({ createdAt: -1 });

const Checkin =
  mongoose.models.Checkin || mongoose.model("Checkin", checkInSchema);

export default Checkin;

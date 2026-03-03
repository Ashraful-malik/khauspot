import mongoose, { Schema } from "mongoose";

const stallReportSchema = new Schema(
  {
    stall: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeaStall",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: {
      type: String,
      enum: ["does_not_exist", "wrong_location", "spam", "duplicate", "other"],
      default: "other",
    },
  },
  { timestamps: true },
);
stallReportSchema.index({ stall: 1, user: 1 }, { unique: true });

const StallReport =
  mongoose.models.Report || mongoose.model("StallReport", stallReportSchema);

export default StallReport;

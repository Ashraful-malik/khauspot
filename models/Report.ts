import mongoose, { Schema } from "mongoose";

const reportSchema = new Schema(
  {
    stallId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeaStall",
      required: true,
    },

    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: {
      type: String,
      enum: ["duplicate", "fake", "closed", "other"],
      required: true,
    },
  },
  { timestamps: true },
);
const Report = mongoose.models.Report || mongoose.model("Report", reportSchema);
export default Report;

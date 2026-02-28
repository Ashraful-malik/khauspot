import mongoose, { Schema } from "mongoose";

const photoSchema = new mongoose.Schema(
  {
    stallId: {
      type: mongoose.Types.ObjectId,
      ref: "TeaStall",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    isApproved: {
      type: Boolean,
      default: true, //what is is approved
    },
  },
  {
    timestamps: true,
  },
);

const Photo = mongoose.models.Photo || mongoose.model("Photo", photoSchema);
export default Photo;

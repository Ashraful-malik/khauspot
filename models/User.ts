import mongoose, { Schema } from "mongoose";
const userSchema = new Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    name: String,
    email: String,
    avatar: String,

    trustScore: {
      type: Number,
      default: 1,
      min: 0,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true },
);
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email_verified: {
      type: Boolean,
      required: true,
      default: false,
    },
    created_at: {
      type: Date,
      required: true,
      default: Date.now,
    },
    profile_picture: {
      type: String,
      required: false,
    },
    profile_bio: {
      type: String,
      required: false,
    },
  }
);

const User = mongoose.model("User", userSchema);

export default User;

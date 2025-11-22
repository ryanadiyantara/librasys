import mongoose from "mongoose";

const usersSchema = new mongoose.Schema(
  {
    memberId: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    identityNumber: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      required: false,
    },
    status: {
      type: Boolean,
      required: false,
      default: false,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

const User = mongoose.model("User", usersSchema);

export default User;

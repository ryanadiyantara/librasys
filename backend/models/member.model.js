import mongoose from "mongoose";

const membersSchema = new mongoose.Schema(
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
      default: "-",
    },
    status: {
      type: Boolean,
      required: false,
      default: true,
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

const Member = mongoose.model("Member", membersSchema);

export default Member;

import mongoose from "mongoose";

const counterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    seq: { type: Number, required: true },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

const counter = mongoose.model("Counter", counterSchema);

export default counter;

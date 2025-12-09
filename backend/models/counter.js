import mongoose from "mongoose";

const counterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    seq: { type: Number, required: true },
  },
  {
    name: { type: String, required: true },
    seq: { type: Number, required: true },
  }
);

const counter = mongoose.model("Counter", counterSchema);

export default counter;

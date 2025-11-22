import mongoose from "mongoose";

const booksSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: false,
      default: "-",
    },
    publisher: {
      type: String,
      required: false,
      default: "-",
    },
    year: {
      type: String,
      required: false,
      default: "-",
    },
    isbn: {
      type: String,
      required: false,
      default: "-",
    },
    category: {
      type: String,
      required: false,
      default: "-",
    },
    stock: {
      type: Number,
      required: true,
    },
    available: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: false,
      default: "-",
    },
    image: {
      type: String,
      required: false,
      default: "-",
    },
    status: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

const Book = mongoose.model("Book", booksSchema);

export default Book;

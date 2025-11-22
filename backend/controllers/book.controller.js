import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import Book from "../models/book.model.js";

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/book/image");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

// Initialize multer upload
const upload = multer({ storage }).single("file");

// Controller to create a new book
export const createBooks = async (req, res) => {
  upload(req, res, async (err) => {
    // Check for file upload error
    if (err) {
      return res.status(500).json({
        success: false,
        message: "File upload failed",
        error: err.message,
      });
    }

    const book = req.body; // user will send this data

    // Validate required fields
    if (!book.title || !book.stock || !book.available) {
      return res.status(400).json({ success: false, message: "Please provide all fields" });
    }

    // Check if any file is uploaded
    if (req.file) {
      const filePath = path.relative("public/book", req.file.path);
      book.image = filePath;
    }

    try {
      // Save new book to database
      const newBook = new Book(book);
      await newBook.save();

      res.status(201).json({ success: true, data: newBook });
    } catch (error) {
      console.error("Error in Create book:", error, message);

      // Delete file if book creation fails
      if (req.file) {
        fs.unlink(req.file.path, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Failed to delete file during error handling:", unlinkErr);
          }
        });
      }
      res.status(500).json({ success: false, message: "Server Error" });
    }
  });
};

// Controller to get all books
export const getBooks = async (req, res) => {
  try {
    // Fetch all books
    const books = await Book.find({});

    res.status(200).json({ success: true, data: books });
  } catch (error) {
    console.log("Error in Fetching books:", error.message);
    res.status(404).json({ success: false, message: "Server Error" });
  }
};

// Controller to get the current book by ID
export const getCurrentBooks = async (req, res) => {
  const { id } = req.params;

  // Validate the book ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Book ID" });
  }

  try {
    // Fetch the book by ID
    const book = await Book.findById(id);

    // Check if book exists
    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    res.status(200).json({ success: true, data: book });
  } catch (error) {
    console.log("Error in Fetching books:", error.message);
    res.status(404).json({ success: false, message: "Server Error" });
  }
};

// Controller to update a book by ID
export const updateBooks = async (req, res) => {
  upload(req, res, async (err) => {
    // Check for file upload error
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "File upload failed", error: err.message });
    }

    const { id } = req.params;
    const book = req.body; // user will send this data

    // Validate the book ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: "Invalid Book Id" });
    }

    // Check if a new file is uploaded
    if (req.file) {
      const filePath = path.relative("public/book", req.file.path);
      book.image = filePath;
    }

    try {
      // Update the book by ID
      const updatedBook = await Book.findByIdAndUpdate(id, book, {
        new: true,
      });

      res.status(200).json({ success: true, data: updatedBook });
    } catch (error) {
      console.log("Error in Updating books:", error.message);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  });
};

// Controller to delete a book by ID
export const deleteBooks = async (req, res) => {
  const { id } = req.params;

  // Validate the book ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Book Id" });
  }

  try {
    // Delete the book by ID
    await Book.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Book deleted" });
  } catch (error) {
    console.log("Error in Deleting books:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

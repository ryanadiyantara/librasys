import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import bcrypt from "bcrypt";
import fs from "fs";
import User from "../models/user.model.js";
import Counter from "../models/counter.js";

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/profileImage");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

// Initialize multer upload
const upload = multer({ storage }).single("file");

// Function to get the next user ID
const getNextUserId = async (prefix = "LIB") => {
  const counter = await Counter.findOneAndUpdate(
    { name: "memberId" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const num = counter.seq.toString().padStart(4, "0");
  return `${prefix}${num}`;
};

// Controller to create a new user
export const createUsers = async (req, res) => {
  const user = req.body; // user will send this data

  // Validate required fields
  if (!user.role || !user.name || !user.email || !user.identityNumber) {
    return res.status(400).json({ success: false, message: "Please provide all fields" });
  }

  // Check if email already exists
  const existingEmail = await User.findOne({ email: user.email });

  if (existingEmail) {
    return res.status(400).json({ success: false, message: "Email is already taken" });
  }

  // Check if identity number already exists
  const existingIdentityNumber = await User.findOne({ identityNumber: user.identityNumber });

  if (existingIdentityNumber) {
    return res.status(400).json({ success: false, message: "Identity Number is already taken" });
  }

  // Set default profile image path
  const defaultImagePath = path.relative("public/profileImage", "public/profileImage/default.png");
  user.profileImage = defaultImagePath;

  try {
    // Add next user ID
    user.memberId = await getNextUserId();

    // Add hashed password
    const hashedPwd = await bcrypt.hash("librasys123", 10); // salt rounds
    user.password = hashedPwd;

    // Save new user to database
    const newUser = new User(user);
    await newUser.save();

    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    console.error("Error in Create user:", error, message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Controller to get all users
export const getUsers = async (req, res) => {
  try {
    // Fetch all users
    const users = await User.find({});

    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.log("Error in Fetching users:", error.message);
    res.status(404).json({ success: false, message: "Server Error" });
  }
};

// Controller to get the current user by ID
export const getCurrentUsers = async (req, res) => {
  const { id } = req.params;

  // Validate the user ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid User ID" });
  }

  try {
    // Fetch the user by ID
    const user = await User.findById(id);

    // Check if user exists
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.log("Error in Fetching users:", error.message);
    res.status(404).json({ success: false, message: "Server Error" });
  }
};

// Controller to update a user by ID
export const updateUsers = async (req, res) => {
  upload(req, res, async (err) => {
    // Check for file upload error
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "File upload failed", error: err.message });
    }

    const { id } = req.params;
    const user = req.body; // user will send this data

    // Validate the user ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      if (req.file) {
        fs.unlink(req.file.path, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Failed to delete file:", unlinkErr);
          }
        });
      }
      return res.status(404).json({ success: false, message: "Invalid User Id" });
    }

    // Check if a new file is uploaded
    if (req.file) {
      const filePath = path.relative("public/profileImage", req.file.path);
      user.profilePicture = filePath;
    }

    try {
      // Update the user by ID
      const updatedUser = await User.findByIdAndUpdate(id, user, {
        new: true,
      });

      res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
      console.log("Error in Updating users:", error.message);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  });
};

// Controller to delete a user by ID
export const deleteUsers = async (req, res) => {
  const { id } = req.params;

  // Validate the user ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid User Id" });
  }

  try {
    // Delete the user by ID
    await User.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "User deleted" });
  } catch (error) {
    console.log("Error in Deleting users:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

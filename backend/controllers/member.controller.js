import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import bcrypt from "bcrypt";
import fs from "fs";
import Member from "../models/member.model.js";
import Counter from "../models/counter.js";

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/profileImage");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

// Initialize multer upload
const upload = multer({ storage }).single("file");

// Function to get the next member ID
const getNextMemberId = async (prefix = "LIB") => {
  const counter = await Counter.findOneAndUpdate(
    { name: "memberId" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const num = counter.seq.toString().padStart(4, "0");
  return `${prefix}${num}`;
};

// Controller to create a new member
export const createMembers = async (req, res) => {
  const member = req.body; // member will send this data

  // Validate required fields
  if (!member.role || !member.name || !member.email || !member.identityNumber) {
    return res.status(400).json({ success: false, message: "Please provide all fields" });
  }

  // Check if email already exists
  const existingEmail = await Member.findOne({ email: member.email });

  if (existingEmail) {
    return res.status(400).json({ success: false, message: "Email is already taken" });
  }

  // Check if identity number already exists
  const existingIdentityNumber = await Member.findOne({ identityNumber: member.identityNumber });

  if (existingIdentityNumber) {
    return res.status(400).json({ success: false, message: "Identity Number is already taken" });
  }

  try {
    // Add next member ID
    member.memberId = await getNextMemberId();

    // Add hashed password
    const hashedPwd = await bcrypt.hash("librasys123", 10); // salt rounds
    member.password = hashedPwd;

    // Save new member to database
    const newMember = new Member(member);
    await newMember.save();

    res.status(201).json({ success: true, data: newMember });
  } catch (error) {
    console.error("Error in Create member:", error, message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Controller to get all members
export const getMembers = async (req, res) => {
  try {
    // Fetch all members
    const members = await Member.find({});

    res.status(200).json({ success: true, data: members });
  } catch (error) {
    console.log("Error in Fetching members:", error.message);
    res.status(404).json({ success: false, message: "Server Error" });
  }
};

// Controller to get the current member by ID
export const getCurrentMembers = async (req, res) => {
  const { id } = req.params;

  // Validate the member ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Member ID" });
  }

  try {
    // Fetch the member by ID
    const member = await Member.findById(id);

    // Check if member exists
    if (!member) {
      return res.status(404).json({ success: false, message: "Member not found" });
    }

    res.status(200).json({ success: true, data: member });
  } catch (error) {
    console.log("Error in Fetching members:", error.message);
    res.status(404).json({ success: false, message: "Server Error" });
  }
};

// Controller to update a member by ID
export const updateMembers = async (req, res) => {
  upload(req, res, async (err) => {
    // Check for file upload error
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "File upload failed", error: err.message });
    }

    const { id } = req.params;
    const member = req.body; // member will send this data

    // Validate the member ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      if (req.file) {
        fs.unlink(req.file.path, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Failed to delete file:", unlinkErr);
          }
        });
      }
      return res.status(404).json({ success: false, message: "Invalid Member Id" });
    }

    // Check if a new file is uploaded
    if (req.file) {
      const filePath = path.relative("public/profileImage", req.file.path);
      member.profilePicture = filePath;
    }

    try {
      // Update the member by ID
      const updatedMember = await Member.findByIdAndUpdate(id, member, {
        new: true,
      });

      res.status(200).json({ success: true, data: updatedMember });
    } catch (error) {
      console.log("Error in Updating members:", error.message);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  });
};

// Controller to delete a member by ID
export const deleteMembers = async (req, res) => {
  const { id } = req.params;

  // Validate the member ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Member Id" });
  }

  try {
    // Delete the member by ID
    await Member.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Member deleted" });
  } catch (error) {
    console.log("Error in Deleting members:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

import mongoose from "mongoose";
import Loan from "../models/loan.model.js";
import Counter from "../models/counter.js";

// Function to get the next loan ID
const getNextLoanId = async (prefix = "LN") => {
  const counter = await Counter.findOneAndUpdate(
    { name: "loanId" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const num = counter.seq.toString().padStart(5, "0");
  return `${prefix}${num}`;
};

// Controller to create a new loan
export const createLoans = async (req, res) => {
  const loan = req.body; // member will send this data

  // Validate required fields
  if (!loan.memberId || loan.bookIds.length === 0 || !loan.borrowDate || !loan.dueDate) {
    return res.status(400).json({ success: false, message: "Please provide all fields" });
  }

  try {
    // Add next loan ID
    loan.loanId = await getNextLoanId();

    // Save new loan to database
    const newLoan = new Loan(loan);
    await newLoan.save();

    // Populate member and book details
    const populatedLoan = await Loan.findById(newLoan._id)
      .populate("memberId", "memberId name email")
      .populate("bookIds", "title author");

    res.status(201).json({ success: true, data: populatedLoan });
  } catch (error) {
    console.error("Error in Create loan:", error, message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Controller to get all loans
export const getLoans = async (req, res) => {
  try {
    // Fetch all loans and populate member and book details
    const loans = await Loan.find({})
      .populate("memberId", "memberId name email")
      .populate("bookIds", "title author");

    res.status(200).json({ success: true, data: loans });
  } catch (error) {
    console.log("Error in Fetching loans:", error.message);
    res.status(404).json({ success: false, message: "Server Error" });
  }
};

// Controller to update a loan by ID
export const updateLoans = async (req, res) => {
  const { id } = req.params;
  const loan = req.body; // member will send this data

  // Validate the loan ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Loan Id" });
  }

  // Validate required fields
  if (!loan.memberId || loan.bookIds.length === 0 || !loan.borrowDate || !loan.dueDate) {
    return res.status(400).json({ success: false, message: "Please provide all fields" });
  }

  try {
    // Update the loan by ID and populate member and book details
    const updatedLoan = await Loan.findByIdAndUpdate(id, loan, {
      new: true,
    })
      .populate("memberId", "memberId name email")
      .populate("bookIds", "title author");

    res.status(200).json({ success: true, data: updatedLoan });
  } catch (error) {
    console.log("Error in Updating loans:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Controller to delete a loan by ID
export const deleteLoans = async (req, res) => {
  const { id } = req.params;

  // Validate the loan ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Loan Id" });
  }

  try {
    // Delete the loan by ID
    await Loan.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Loan deleted" });
  } catch (error) {
    console.log("Error in Deleting loans:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

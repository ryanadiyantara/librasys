import mongoose from "mongoose";
import Loan from "../models/loan.model.js";

// Controller to create a new loan
export const createLoans = async (req, res) => {
  const loan = req.body; // user will send this data

  // Validate required fields
  if (!loan.userId || !loan.bookId || !loan.borrowDate || !loan.dueDate) {
    return res.status(400).json({ success: false, message: "Please provide all fields" });
  }

  try {
    // Save new loan to database
    const newLoan = new Loan(loan);
    await newLoan.save();

    res.status(201).json({ success: true, data: newLoan });
  } catch (error) {
    console.error("Error in Create loan:", error, message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Controller to get all loans
export const getLoans = async (req, res) => {
  try {
    // Fetch all loans
    const loans = await Loan.find({});

    res.status(200).json({ success: true, data: loans });
  } catch (error) {
    console.log("Error in Fetching loans:", error.message);
    res.status(404).json({ success: false, message: "Server Error" });
  }
};

// Controller to update a loan by ID
export const updateLoans = async (req, res) => {
  const { id } = req.params;
  const loan = req.body; // user will send this data

  // Validate the loan ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Loan Id" });
  }

  try {
    // Update the loan by ID
    const updatedLoan = await Loan.findByIdAndUpdate(id, loan, {
      new: true,
    });

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

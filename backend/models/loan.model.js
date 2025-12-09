import mongoose from "mongoose";

const loansSchema = new mongoose.Schema(
  {
    loanId: {
      type: String,
      required: true,
    },
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },
    bookIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: true,
      },
    ],
    borrowDate: {
      type: Date,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    returnDate: {
      type: Date,
      required: false,
      default: null,
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

const Loan = mongoose.model("Loan", loansSchema);

export default Loan;

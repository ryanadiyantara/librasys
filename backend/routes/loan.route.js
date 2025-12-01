import express from "express";
import { getLoans, createLoans, updateLoans, deleteLoans } from "../controllers/loan.controller.js";
import verifyJWT from "../middleware/verifyJWT.js";

const router = express.Router();

// Verify JWT
router.use(verifyJWT);

// Routes
router.get("/", getLoans);
router.post("/", createLoans);
router.put("/:id", updateLoans);
router.delete("/:id", deleteLoans);

export default router;

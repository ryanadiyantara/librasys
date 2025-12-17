import express from "express";
import { getBooks, createBooks, updateBooks, deleteBooks } from "../controllers/book.controller.js";
import verifyJWT from "../middleware/verifyJWT.js";

const router = express.Router();

// Routes
router.get("/", getBooks);

// Verify JWT
router.use(verifyJWT);

// Routes
router.post("/", createBooks);
router.put("/:id", updateBooks);
router.delete("/:id", deleteBooks);

export default router;

import express from "express";
import {
  getMembers,
  getCurrentMembers,
  createMembers,
  updateMembers,
  deleteMembers,
} from "../controllers/member.controller.js";
import verifyJWT from "../middleware/verifyJWT.js";

const router = express.Router();

// Verify JWT
// router.use(verifyJWT);

// Routes
router.get("/", getMembers);
router.get("/:id", getCurrentMembers);
router.post("/", createMembers);
router.put("/:id", updateMembers);
router.delete("/:id", deleteMembers);

export default router;

import express from "express";
import {
  postProblem,
  listProblems,
  listMyProblems,
  fixProblem,
  removeProblem,
  listAllProblems,
} from "../controllers/problemController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ─────────────── PUBLIC ROUTES ───────────────

// GET /api/problems - All open (unfixed) problems for providers
router.get("/", listProblems);

// GET /api/problems/all - All problems including fixed (for admin or stats)
router.get("/all", listAllProblems);

// ─────────────── PROTECTED ROUTES ───────────────

// POST /api/problems - Create a new problem (client only)
router.post("/", verifyToken, postProblem);

// GET /api/problems/mine - Get all problems created by the logged-in user
router.get("/mine", verifyToken, listMyProblems);

// PUT /api/problems/:id/fix - Mark a problem as fixed (owner only)
router.put("/:id/fix", verifyToken, fixProblem);

// DELETE /api/problems/:id - Remove a problem (owner only)
router.delete("/:id", verifyToken, removeProblem);

export default router;

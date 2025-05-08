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

// Public → list problems
router.get("/", listProblems);

// Protected → create problem
router.post("/", verifyToken, postProblem);

// Protected → List my problems
router.get("/mine", verifyToken, listMyProblems);

// Protected → Mark as fixed
router.put("/:id/fix", verifyToken, fixProblem);

// Protected → Delete problem
router.delete("/:id", verifyToken, removeProblem);

// Public → List all problems
router.get("/all", listAllProblems);

export default router;

import express from "express";
import { register, login, logout } from "../controllers/authController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { findUserById } from "../models/userModel.js";

const router = express.Router();

// ─────────────── Auth Routes ───────────────

// POST /api/auth/register  Register new user
router.post("/register", register);

// POST /api/auth/login  Login existing user
router.post("/login", login);

// POST /api/auth/logout  Logout user
router.post("/logout", logout);

// GET /api/auth/me - Get current user
router.get("/me", verifyToken, async (req, res) => {
  // req.user is set by verifyToken
  // Optionally, fetch fresh user from DB:
  const user = await findUserById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

export default router;

import express from "express";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

// ─────────────── Auth Routes ───────────────

// POST /api/auth/register  Register new user
router.post("/register", register);

// POST /api/auth/login  Login existing user
router.post("/login", login);

export default router;

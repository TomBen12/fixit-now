import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "../models/userModel.js";

const SECRET = process.env.JWT_SECRET || "mysecret";

// ─────────────── Register a New User ───────────────
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const [user] = await createUser({ username, email, password_hash });

    res.status(201).json({ user });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// ─────────────── Login Existing User ───────────────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: "7d" });

    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};

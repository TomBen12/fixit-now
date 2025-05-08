import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "../models/userModel.js";

const SECRET = process.env.JWT_SECRET || "mysecret";

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    return res.status(400).json({ message: "Email already registered" });
  }

  const password_hash = await bcrypt.hash(password, 10);
  const newUser = await createUser({ username, email, password_hash });

  res.status(201).json({ user: newUser[0] });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: "7d" });

  res.json({ token });
};

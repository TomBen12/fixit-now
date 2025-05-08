import jwt from "jsonwebtoken";
import { findUserById } from "../models/userModel.js";

const SECRET = process.env.JWT_SECRET || "mysecret";

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    const user = await findUserById(decoded.id);

    if (!user) return res.status(401).json({ message: "Invalid token" });

    req.user = user; // Pass user info to route
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

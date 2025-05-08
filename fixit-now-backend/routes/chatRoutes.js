import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  startChat,
  getChatsOfProblem,
  getChatMessages,
} from "../controllers/chatController.js";

const router = express.Router();

// Start new chat
router.post("/", verifyToken, startChat);

// Get chats of problem
router.get("/problem/:id", verifyToken, getChatsOfProblem);

// Get messages (history)
router.get("/:id/messages", verifyToken, getChatMessages);

export default router;

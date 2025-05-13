import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/upload.js";
import {
  startChat,
  getChatsOfProblem,
  getChatMessages,
  uploadChatMedia,
  getUserChats,
} from "../controllers/chatController.js";

const router = express.Router();

// ─────────────── Chat Routes ───────────────

// POST /api/chats/  Provider starts new chat on someone else's problem
router.post("/", verifyToken, startChat);

// GET /api/chats/problem/:id  Get all chats for a given problem (client only)
router.get("/problem/:id", verifyToken, getChatsOfProblem);

// GET /api/chats/user Get all chats involving the logged-in user (inbox)
router.get("/user", verifyToken, getUserChats);

// GET /api/chats/:id/messages  Get full message history of a chat
router.get("/:id/messages", verifyToken, getChatMessages);

// POST /api/chats/:id/messages Upload new media/text message
router.post(
  "/:id/messages",
  verifyToken,
  upload.single("file"),
  uploadChatMedia
);

export default router;

import db from "../db/knex.js";
import {
  createChat,
  getChatsForProblem,
  getMessagesForChat,
  getChatsByUserId,
  createMessage,
  getUserChatroomsWithDetails,
} from "../models/chatModel.js";
import { findProblemById } from "../models/problemModel.js";

// ─────────────── Start New Chat (Provider Only) ───────────────
export const startChat = async (req, res) => {
  try {
    const { problem_id } = req.body;
    const provider_id = req.user.id;

    const problem = await findProblemById(problem_id);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    if (problem.user_id === provider_id) {
      return res.status(400).json({
        message: "You cannot start a chat on your own problem",
      });
    }

    // Check if a chat already exists for this provider/problem
    const existingChat = await db("problem_chats")
      .where({ problem_id, provider_id })
      .first();

    if (existingChat) {
      // Return the existing chatroom (status 200)
      return res.status(200).json(existingChat);
    }

    const [chat] = await createChat({
      problem_id,
      client_id: problem.user_id,
      provider_id,
    });

    res.status(201).json(chat);
  } catch (err) {
    console.error("startChat error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────── Get Chats for a Specific Problem (Owner Only) ───────────────
export const getChatsOfProblem = async (req, res) => {
  try {
    const problemId = req.params.id;
    const userId = req.user.id;

    const problem = await findProblemById(problemId);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    if (problem.user_id !== userId) {
      return res.status(403).json({ message: "Not your problem" });
    }

    const chats = await getChatsForProblem(problemId);
    res.json(chats);
  } catch (err) {
    console.error("getChatsOfProblem error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────── Get All Chats Involving Logged-In User ───────────────
export const getUserChats = async (req, res) => {
  try {
    const userId = req.user.id;
    const chats = await getChatsByUserId(userId);
    res.json(chats);
  } catch (err) {
    console.error("getUserChats error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────── Get All Messages in Chat ───────────────
export const getChatMessages = async (req, res) => {
  try {
    const chatId = req.params.id;
    const messages = await getMessagesForChat(chatId);
    res.json(messages);
  } catch (err) {
    console.error("getChatMessages error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────── Upload Chat Media Message ───────────────
export const uploadChatMedia = async (req, res) => {
  try {
    const chat_id = req.params.id;
    const from_user_id = req.user.id;
    const content = req.body.content || null;
    const file_url = req.file ? `/uploads/${req.file.filename}` : null;

    const [savedMessage] = await createMessage({
      chat_id,
      from_user_id,
      content,
      file_url,
    });

    res.status(201).json(savedMessage);
  } catch (err) {
    console.error("uploadChatMedia error:", err);
    res.status(500).json({ message: "Media upload failed" });
  }
};

// GET /api/chats/mine - All chatrooms for the logged-in user with details
export const getUserChatrooms = async (req, res) => {
  try {
    const userId = req.user.id;
    const chatrooms = await getUserChatroomsWithDetails(userId);
    res.json(chatrooms);
  } catch (err) {
    console.error("getUserChatrooms error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//Mark all messages in a chat as read for the current user
export const markChatAsRead = async (req, res) => {
  try {
    const chatId = req.params.id;
    const userId = req.user.id;
    // Mark all messages in this chat not sent by the user as read
    await db("chat_messages")
      .where({ chat_id: chatId })
      .andWhereNot("from_user_id", userId)
      .update({ is_read: true });
    res.json({ success: true });
  } catch (err) {
    console.error("markChatAsRead error:", err);
    res.status(500).json({ message: "Failed to mark messages as read" });
  }
};

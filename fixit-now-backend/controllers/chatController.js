import db from "../db/knex.js";
import {
  createChat,
  getChatsForProblem,
  getChatById,
  getMessagesForChat,
} from "../models/chatModel.js";
import { findProblemById } from "../models/problemModel.js";

// Start new chat (provider starts chat with problem)
export const startChat = async (req, res) => {
  try {
    const { problem_id } = req.body;
    const provider_id = req.user.id;

    const problem = await findProblemById(problem_id);
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    if (problem.user_id === provider_id) {
      return res
        .status(400)
        .json({ message: "You cannot start chat on your own problem" });
    }

    const existingChat = await db("problem_chats")
      .where({ problem_id, provider_id })
      .first();

    if (existingChat) {
      return res.status(400).json({ message: "Chat already exists" });
    }

    const chat = await createChat({
      problem_id,
      client_id: problem.user_id,
      provider_id,
    });

    res.status(201).json(chat[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get chats of problem (only owner)
export const getChatsOfProblem = async (req, res) => {
  try {
    const problemId = req.params.id;

    const problem = await findProblemById(problemId);
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    if (problem.user_id !== req.user.id) {
      return res.status(403).json({ message: "Not your problem" });
    }

    const chats = await getChatsForProblem(problemId);
    res.json(chats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get messages (history)
export const getChatMessages = async (req, res) => {
  try {
    const chatId = req.params.id;

    const messages = await getMessagesForChat(chatId);
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

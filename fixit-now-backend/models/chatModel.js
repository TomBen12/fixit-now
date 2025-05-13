import db from "../db/knex.js";

// ──────────── Chats ────────────

// Create a new chat
export const createChat = (chat) => {
  return db("problem_chats").insert(chat).returning("*");
};

// Get all chats for a specific problem (owner only)
export const getChatsForProblem = (problem_id) => {
  return db("problem_chats").where({ problem_id });
};

// Get a single chat by ID
export const getChatById = (chat_id) => {
  return db("problem_chats").where({ id: chat_id }).first();
};

// Get all chats where user is client or provider
export const getChatsByUserId = (user_id) => {
  return db("problem_chats")
    .where("client_id", user_id)
    .orWhere("provider_id", user_id)
    .orderBy("created_at", "desc");
};

// ──────────── Messages ────────────

// Create a new message (text or media)
export const createMessage = (message) => {
  return db("chat_messages").insert(message).returning("*");
};

// Get all messages for a specific chat
export const getMessagesForChat = (chat_id) => {
  return db("chat_messages").where({ chat_id }).orderBy("created_at", "asc");
};

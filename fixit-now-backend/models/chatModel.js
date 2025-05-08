import db from "../db/knex.js";

// Create new chat
export const createChat = (chat) => {
  return db("problem_chats").insert(chat).returning("*");
};

// Get chats for problem
export const getChatsForProblem = (problem_id) => {
  return db("problem_chats").where({ problem_id });
};

// Get single chat by ID
export const getChatById = (chat_id) => {
  return db("problem_chats").where({ id: chat_id }).first();
};

// Get user's chats (optional → inbox for later)
export const getUserChats = (user_id) => {
  return db("problem_chats")
    .where("client_id", user_id)
    .orWhere("provider_id", user_id);
};

// Save new message
export const createMessage = (message) => {
  return db("chat_messages").insert(message).returning("*");
};

// Get messages for chat
export const getMessagesForChat = (chat_id) => {
  return db("chat_messages").where({ chat_id }).orderBy("created_at", "asc");
};

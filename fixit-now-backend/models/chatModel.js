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

// Get all chatrooms for a user with problem title, other user, and unread count
export const getUserChatroomsWithDetails = async (user_id) => {
  // Get all chatrooms where user is client or provider
  const chatrooms = await db("problem_chats")
    .join("problems", "problem_chats.problem_id", "problems.id")
    .join("users as client", "problem_chats.client_id", "client.id")
    .join("users as provider", "problem_chats.provider_id", "provider.id")
    .select(
      "problem_chats.id",
      "problem_chats.problem_id",
      "problems.title as problem_title",
      "problem_chats.client_id",
      "problem_chats.provider_id",
      db.raw(
        `CASE WHEN problem_chats.client_id = ? THEN provider.id ELSE client.id END as other_user_id`,
        [user_id]
      ),
      db.raw(
        `CASE WHEN problem_chats.client_id = ? THEN provider.username ELSE client.username END as other_user_username`,
        [user_id]
      ),
      db.raw(
        `CASE WHEN problem_chats.client_id = ? THEN provider.email ELSE client.email END as other_user_email`,
        [user_id]
      )
    )
    .where(function () {
      this.where("problem_chats.client_id", user_id).orWhere(
        "problem_chats.provider_id",
        user_id
      );
    })
    .orderBy("problem_chats.updated_at", "desc");

  // For each chatroom, get unread count
  const chatroomIds = chatrooms.map((c) => c.id);
  let unreadCounts = [];
  if (chatroomIds.length > 0) {
    unreadCounts = await db("chat_messages")
      .whereIn("chat_id", chatroomIds)
      .andWhere("is_read", false)
      .andWhereNot("from_user_id", user_id)
      .select("chat_id")
      .count("id as unread_count")
      .groupBy("chat_id");
  }
  const unreadMap = Object.fromEntries(
    unreadCounts.map((row) => [row.chat_id, Number(row.unread_count)])
  );

  return chatrooms.map((c) => ({
    id: c.id,
    problem_title: c.problem_title,
    other_user: {
      id: c.other_user_id,
      username: c.other_user_username,
      email: c.other_user_email,
    },
    unread_count: unreadMap[c.id] || 0,
  }));
};

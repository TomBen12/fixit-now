import db from "../db/knex.js";

async function resetDatabase() {
  await db.raw(`
    TRUNCATE users, problems, problem_chats, chat_messages RESTART IDENTITY CASCADE;
  `);
  console.log("Database reset complete.");
  process.exit();
}

resetDatabase();

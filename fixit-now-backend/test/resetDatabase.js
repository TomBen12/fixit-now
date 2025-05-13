import db from "../db/knex.js";

async function reset() {
  try {
    await db.raw(`
      TRUNCATE users, problems, problem_files, problem_chats, chat_messages 
      RESTART IDENTITY CASCADE;
    `);
    console.log(" Database reset successful.");
    process.exit(0);
  } catch (err) {
    console.error("Failed to reset DB:", err);
    process.exit(1);
  }
}

reset();

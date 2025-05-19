import knex from "../db/knex.js";

async function clearProblems() {
  try {
    await knex("problems").del();
    console.log("All problems deleted.");
  } catch (err) {
    console.error("Error deleting problems:", err);
  } finally {
    await knex.destroy();
  }
}

clearProblems();

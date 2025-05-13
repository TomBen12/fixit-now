import db from "../db/knex.js";

// ─────────────── Create ───────────────

// Add a new problem (submitted by client)
export const createProblem = (problem) => {
  return db("problems").insert(problem).returning("*");
};

// ─────────────── Read ───────────────

// Get all problems (for admin/dev/debugging)
export const getAllProblems = () => {
  return db("problems").orderBy("created_at", "desc");
};

// Get only problems that are still open (for providers)
export const getAllOpenProblems = () => {
  return db("problems")
    .where({ is_fixed: false })
    .orderBy("created_at", "desc");
};

// Get all problems created by a specific user
export const getUserProblems = (user_id) => {
  return db("problems").where({ user_id }).orderBy("created_at", "desc");
};

// Find a problem by ID
export const findProblemById = (problem_id) => {
  return db("problems").where({ id: problem_id }).first();
};

// ─────────────── Update ───────────────

// Mark a problem as fixed
export const markProblemAsFixed = (problem_id) => {
  return db("problems")
    .where({ id: problem_id })
    .update({ is_fixed: true })
    .returning("*");
};

// ─────────────── Delete ───────────────

// Delete a problem
export const deleteProblem = (problem_id) => {
  return db("problems").where({ id: problem_id }).del();
};

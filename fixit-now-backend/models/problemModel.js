import db from "../db/knex.js";

// ─────────────── Create ───────────────

// Add a new problem (submitted by client)
export const createProblem = (problem) => {
  return db("problems").insert(problem).returning("*");
};

// ─────────────── Read ───────────────

// get all problems (for admin/dev/debugging)
export const getAllProblems = () => {
  return db("problems").orderBy("created_at", "desc");
};

// get only problems that are still open (for providers)
export const getAllOpenProblems = () => {
  return db("problems")
    .where({ is_fixed: false })
    .orderBy("created_at", "desc");
};

// Get problems created by a specific user
export const getUserProblems = (user_id) => {
  return db("problems").where({ user_id }).orderBy("created_at", "desc");
};

// Find problem by ID
export const findProblemById = (problem_id) => {
  return db("problems").where({ id: problem_id }).first();
};

// Get problems wth owner info
export const getAllProblemsWithOwner = () => {
  return db("problems")
    .join("users", "problems.user_id", "users.id")
    .select(
      "problems.*",
      db.raw("COALESCE(users.username, '') as owner_username"),
      db.raw("COALESCE(users.email, '') as owner_email"),
      db.raw("users.id as owner_id")
    )
    .orderBy("problems.created_at", "desc");
};

// ─────────────── Update ───────────────

// Mark a problem as fixed
export const markProblemAsFixed = (problem_id) => {
  return db("problems")
    .where({ id: problem_id })
    .update({ is_fixed: true })
    .returning("*");
};

// update media array for problem
export const updateProblemMedia = (problem_id, media) => {
  return db("problems")
    .where({ id: problem_id })
    .update({ media: JSON.stringify(media) })
    .returning("media");
};

// ─────────────── Delete ───────────────

// delete problem
export const deleteProblem = (problem_id) => {
  return db("problems").where({ id: problem_id }).del();
};

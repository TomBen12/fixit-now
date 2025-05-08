import db from "../db/knex.js";

export const createProblem = (problem) => {
  return db("problems").insert(problem).returning("*");
};

export const getAllOpenProblems = () => {
  return db("problems")
    .where({ is_fixed: false })
    .orderBy("created_at", "desc");
};

export const getUserProblems = (user_id) => {
  return db("problems").where({ user_id }).orderBy("created_at", "desc");
};

export const markProblemAsFixed = (problem_id) => {
  return db("problems")
    .where({ id: problem_id })
    .update({ is_fixed: true })
    .returning("*");
};

export const findProblemById = (problem_id) => {
  return db("problems").where({ id: problem_id }).first();
};

export const deleteProblem = (problem_id) => {
  return db("problems").where({ id: problem_id }).del();
};

export const getAllProblems = () => {
  return db("problems").orderBy("created_at", "desc");
};
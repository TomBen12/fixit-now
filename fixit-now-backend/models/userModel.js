import db from "../db/knex.js";

// Create a new user (register)
export const createUser = (user) => {
  return db("users").insert(user).returning("*");
};

// Find user by email (login or duplication check)
export const findUserByEmail = (email) => {
  return db("users").where({ email }).first();
};

// Find user by ID (used in verifyToken, profile fetch, etc.)
export const findUserById = (id) => {
  return db("users").where({ id }).first();
};

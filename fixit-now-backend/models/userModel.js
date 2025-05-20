import db from "../db/knex.js";

// Create a new user
export const createUser = (user) => {
  return db("users").insert(user).returning("*");
};

// Find user by email
export const findUserByEmail = (email) => {
  return db("users").where({ email }).first();
};

// Find user by ID fo verifyToken, profile fetch...
export const findUserById = (id) => {
  return db("users").where({ id }).first();
};

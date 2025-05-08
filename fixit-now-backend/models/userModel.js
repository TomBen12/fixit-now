import db from "../db/knex.js";

export const createUser = (user) => {
  return db("users").insert(user).returning("*");
};

export const findUserByEmail = (email) => {
  return db("users").where({ email }).first();
};

export const findUserById = (id) => {
  return db("users").where({ id }).first();
};

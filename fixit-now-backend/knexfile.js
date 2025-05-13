import dotenv from "dotenv";
dotenv.config();

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const config = {
  development: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || "fixitnow",
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "1234",
    },
    migrations: {
      directory: "./db/migrations",
    },
  },

  production: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      ssl: { rejectUnauthorized: false }, // for Render or Heroku
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};

export default config;

export async function up(knex) {
  return knex.schema.createTable("problem_chats", (table) => {
    table.increments("id").primary(); // Chat ID (PK)

    table
      .integer("problem_id") // FK to problems
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("problems")
      .onDelete("CASCADE");

    table
      .integer("client_id") // FK to users (problem owner)
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table
      .integer("provider_id") // FK to users (repairer/helper)
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table.timestamps(true, true); // created_at, updated_at
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("problem_chats");
}

export async function up(knex) {
  return knex.schema.createTable("problem_chats", (table) => {
    table.increments("id").primary();
    table
      .integer("problem_id")
      .references("id")
      .inTable("problems")
      .onDelete("CASCADE");
    table
      .integer("client_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .integer("provider_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.timestamps(true, true);
  });
};

export async function down(knex) {
  return knex.schema.dropTable("problem_chats");
};

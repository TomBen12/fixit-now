export async function up(knex) {
  return knex.schema.createTable("chat_messages", (table) => {
    table.increments("id").primary();
    table
      .integer("chat_id")
      .references("id")
      .inTable("problem_chats")
      .onDelete("CASCADE");
    table
      .integer("from_user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.text("content");
    table.string("file_url");
    table.timestamps(true, true);
  });
}

export async function down(knex) {
  return knex.schema.dropTable("chat_messages");
}

export async function up(knex) {
  return knex.schema.createTable("chat_messages", (table) => {
    table.increments("id").primary();
    table
      .integer("chat_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("problem_chats")
      .onDelete("CASCADE");
    table
      .integer("sender_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.text("message").notNullable();
    table.boolean("is_read").defaultTo(false);
    table.timestamps(true, true);
  });
}

export async function down(knex) {
  return knex.schema.dropTableIfExists("chat_messages");
}

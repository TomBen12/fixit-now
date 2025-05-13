export async function up(knex) {
  return knex.schema.createTable("chat_messages", (table) => {
    table.increments("id").primary(); // Message ID (PK)

    table
      .integer("chat_id") // FK to problem_chats
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("problem_chats")
      .onDelete("CASCADE");

    table
      .integer("from_user_id") // FK to users (sender)
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table.text("content"); // Text message (optional)
    table.string("file_url"); // Media file URL (optional)
    table.timestamps(true, true); // created_at, updated_at
  });
}

export async function down(knex) {
  return knex.schema.dropTableIfExists("chat_messages");
}

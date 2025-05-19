export async function up(knex) {
  // 1. Add new columns
  await knex.schema.alterTable("chat_messages", (table) => {
    table.integer("from_user_id").unsigned().references("id").inTable("users");
    table.text("content").nullable();
    table.string("file_url").nullable();
  });

  // 2. Copy data from old columns to new ones
  await knex.raw(
    "UPDATE chat_messages SET from_user_id = sender_id, content = message"
  );

  // 3. Drop old columns
  await knex.schema.alterTable("chat_messages", (table) => {
    table.dropColumn("sender_id");
    table.dropColumn("message");
  });
}

export async function down(knex) {
  // 1. Add old columns back
  await knex.schema.alterTable("chat_messages", (table) => {
    table.integer("sender_id").unsigned().references("id").inTable("users");
    table.text("message").notNullable();
  });

  // 2. Copy data back
  await knex.raw(
    "UPDATE chat_messages SET sender_id = from_user_id, message = content"
  );

  // 3. Drop new columns
  await knex.schema.alterTable("chat_messages", (table) => {
    table.dropColumn("from_user_id");
    table.dropColumn("content");
    table.dropColumn("file_url");
  });
}

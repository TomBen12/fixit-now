export async function up(knex) {
  return knex.schema.createTable("problems", (table) => {
    table.increments("id").primary();
    table.string("title").notNullable();
    table.text("description").notNullable();
    table
      .integer("client_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .integer("provider_id")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("SET NULL");
    table
      .enum("status", ["open", "in_progress", "completed", "cancelled"])
      .notNullable()
      .defaultTo("open");
    table.decimal("budget", 10, 2);
    table.timestamps(true, true);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("problems");
}

export async function up(knex) {
  return knex.schema.createTable("problems", (table) => {
    table.increments("id").primary();
    table
      .integer("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.string("title").notNullable();
    table.text("description");
    table.boolean("is_fixed").defaultTo(false);
    table.timestamps(true, true);
  });
};

export async function down(knex) {
  return knex.schema.dropTable("problems");
};

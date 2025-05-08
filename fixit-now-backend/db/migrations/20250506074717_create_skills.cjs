export async function up(knex) {
  return knex.schema.createTable("skills", (table) => {
    table.increments("id").primary();
    table
      .integer("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.string("skill_name").notNullable();
  });
};

export async function down(knex) {
  return knex.schema.dropTable("skills");
};

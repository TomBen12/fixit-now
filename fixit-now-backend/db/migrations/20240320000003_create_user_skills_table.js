export async function up(knex) {
  return knex.schema.createTable("user_skills", (table) => {
    table.increments("id").primary();
    table
      .integer("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .integer("skill_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("skills")
      .onDelete("CASCADE");
    table.integer("experience_years").defaultTo(0);
    table.text("description");
    table.timestamps(true, true);

    // Add unique constraint to prevent duplicate user-skill combinations
    table.unique(["user_id", "skill_id"]);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("user_skills");
}
 
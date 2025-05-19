export async function up(knex) {
  return knex.schema.createTable("problem_skills", (table) => {
    table.increments("id").primary();
    table
      .integer("problem_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("problems")
      .onDelete("CASCADE");
    table
      .integer("skill_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("skills")
      .onDelete("CASCADE");
    table.timestamps(true, true);

    // Add unique constraint to prevent duplicate problem-skill combinations
    table.unique(["problem_id", "skill_id"]);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("problem_skills");
}

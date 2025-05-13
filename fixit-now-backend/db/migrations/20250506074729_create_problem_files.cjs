export async function up(knex) {
  return knex.schema.createTable("problem_files", (table) => {
    table.increments("id").primary(); // File ID (PK)

    table
      .integer("problem_id") // FK to problems.id
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("problems")
      .onDelete("CASCADE");

    table.string("file_url").notNullable(); // Path to uploaded file
    table.string("file_type"); // MIME type (optional)
    table.timestamps(true, true); // created_at, updated_at
  });
}

export async function down(knex) {
  return knex.schema.dropTableIfExists("problem_files");
}

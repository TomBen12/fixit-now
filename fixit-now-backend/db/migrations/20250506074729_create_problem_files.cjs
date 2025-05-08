export async function up(knex) {
  return knex.schema.createTable("problem_files", (table) => {
    table.increments("id").primary();
    table
      .integer("problem_id")
      .references("id")
      .inTable("problems")
      .onDelete("CASCADE");
    table.string("file_url").notNullable();
    table.string("file_type");
    table.timestamps(true, true);
  });
};

export async function down(knex) {
  return knex.schema.dropTable("problem_files");
};

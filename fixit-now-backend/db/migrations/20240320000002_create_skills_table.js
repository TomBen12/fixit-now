export async function up(knex) {
  return knex.schema.createTable("skills", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable().unique();
    table.text("description");
    table.timestamps(true, true);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("skills");
}

export async function up(knex) {
  return knex.schema.alterTable("problems", (table) => {
    table.json("media").defaultTo("[]");
  });
}

export async function down(knex) {
  return knex.schema.alterTable("problems", (table) => {
    table.dropColumn("media");
  });
}

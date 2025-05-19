export function up(knex) {
  return knex.schema.table("problems", function (table) {
    table.boolean("is_fixed").notNullable().defaultTo(false);
  });
}

export function down(knex) {
  return knex.schema.table("problems", function (table) {
    table.dropColumn("is_fixed");
  });
}

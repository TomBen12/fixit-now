export function up(knex) {
  return knex.schema.table("problems", function (table) {
    table.dropColumn("client_id");
  });
}

export function down(knex) {
  return knex.schema.table("problems", function (table) {
    table.integer("client_id").notNullable();
  });
}

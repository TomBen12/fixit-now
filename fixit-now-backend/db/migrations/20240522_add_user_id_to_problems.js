export function up(knex) {
  return knex.schema.table("problems", function (table) {
    table
      .integer("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users");
  });
}

export function down(knex) {
  return knex.schema.table("problems", function (table) {
    table.dropColumn("user_id");
  });
}

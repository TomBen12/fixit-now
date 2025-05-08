export async function up(knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("username").notNullable();
    table.string("email").notNullable().unique();
    table.string("password_hash").notNullable();
    table.string("profile_picture_url");
    table.text("bio");
    table.timestamps(true, true);
  });
};

export async function down(knex) {
  return knex.schema.dropTable("users");
};

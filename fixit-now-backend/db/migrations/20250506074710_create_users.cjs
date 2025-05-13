export async function up(knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments("id").primary(); // Primary key
    table.string("username").notNullable(); // Display name
    table.string("email").notNullable().unique(); // Login identity
    table.string("password_hash").notNullable(); // Hashed password
    table.string("profile_picture_url"); // Optional profile image
    table.text("bio"); // Optional user bio
    table.timestamps(true, true); // created_at / updated_at
  });
}

export async function down(knex) {
  return knex.schema.dropTableIfExists("users");
}

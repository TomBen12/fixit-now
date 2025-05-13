export async function up(knex) {
  return knex.schema.createTable("problems", (table) => {
    table.increments("id").primary(); // Problem ID (PK)

    table
      .integer("user_id") // Foreign key to users
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table.string("title").notNullable(); // Short summary/title
    table.text("description"); // Detailed description
    table.boolean("is_fixed").defaultTo(false); // Status flag
    table.timestamps(true, true); // created_at, updated_at
  });
}

export async function down(knex) {
  return knex.schema.dropTableIfExists("problems");
}

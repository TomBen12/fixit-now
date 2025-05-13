export async function up(knex) {
  return knex.schema.createTable("skills", (table) => {
    table.increments("id").primary(); // Primary key
    table
      .integer("user_id") // FK to users.id
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.string("skill_name").notNullable(); // Name of the skill
  });
}

export async function down(knex) {
  return knex.schema.dropTableIfExists("skills");
}

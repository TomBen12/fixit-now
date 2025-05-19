export async function seed(knex) {
  await knex("skills").del();
  await knex("skills").insert([
    { name: "Plumbing" },
    { name: "Electrical" },
    { name: "Carpentry" },
    { name: "Painting" },
    { name: "IT Support" },
    { name: "Appliance Repair" },
    { name: "Landscaping" },
    { name: "Roofing" },
    { name: "HVAC" },
    { name: "General Handyman" },
  ]);
}

export async function seed(knex) {
  // Deletes ALL existing entries
  await knex("skills").del();

  // Inserts seed entries
  await knex("skills").insert([
    {
      name: "Plumbing",
      description: "Installation, repair, and maintenance of plumbing systems",
    },
    {
      name: "Electrical",
      description: "Electrical repairs, installations, and maintenance",
    },
    {
      name: "Carpentry",
      description: "Woodworking, furniture repair, and structural work",
    },
    {
      name: "HVAC",
      description: "Heating, ventilation, and air conditioning systems",
    },
    {
      name: "Painting",
      description: "Interior and exterior painting services",
    },
    {
      name: "Cleaning",
      description: "Residential and commercial cleaning services",
    },
    {
      name: "Landscaping",
      description: "Garden maintenance and landscaping services",
    },
    {
      name: "Appliance Repair",
      description: "Repair and maintenance of household appliances",
    },
    {
      name: "Roofing",
      description: "Roof repairs, maintenance, and installation",
    },
    {
      name: "General Handyman",
      description: "General home repairs and maintenance",
    },
  ]);
}

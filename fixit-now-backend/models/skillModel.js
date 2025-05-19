import knex from "../db/knex.js";

export const getAllSkills = () => {
  return knex("skills").select("id", "name", "description");
};

export const getUserSkills = (userId) => {
  return knex("user_skills")
    .join("skills", "user_skills.skill_id", "skills.id")
    .where("user_skills.user_id", userId)
    .select("skills.id", "skills.name", "skills.description");
};

export const setUserSkills = async (userId, skillIds) => {
  // Remove existing skills
  await knex("user_skills").where({ user_id: userId }).del();
  // Insert new skills
  if (Array.isArray(skillIds) && skillIds.length > 0) {
    const rows = skillIds.map((skillId) => ({
      user_id: userId,
      skill_id: skillId,
    }));
    await knex("user_skills").insert(rows);
  }
  // Return updated skills
  return getUserSkills(userId);
};

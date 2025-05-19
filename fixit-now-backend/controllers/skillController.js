import {
  getAllSkills,
  getUserSkills,
  setUserSkills,
} from "../models/skillModel.js";

export const listSkills = async (req, res) => {
  try {
    const skills = await getAllSkills();
    res.json({ skills });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch skills" });
  }
};

export const getUserSkillsController = async (req, res) => {
  try {
    const userId = req.params.id;
    const skills = await getUserSkills(userId);
    res.json({ skills });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user skills" });
  }
};

export const setUserSkillsController = async (req, res) => {
  try {
    const userId = req.params.id;
    const { skillIds } = req.body;
    const skills = await setUserSkills(userId, skillIds);
    res.json({ skills });
  } catch (err) {
    res.status(500).json({ message: "Failed to update user skills" });
  }
};

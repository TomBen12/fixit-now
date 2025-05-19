import express from "express";
import {
  listSkills,
  getUserSkillsController,
  setUserSkillsController,
} from "../controllers/skillController.js";

const router = express.Router();

// GET /api/skills - list all skills
router.get("/", listSkills);

// GET /api/users/:id/skills - get a user's skills
router.get("/user/:id", getUserSkillsController);

// POST /api/users/:id/skills - set a user's skills
router.post("/user/:id", setUserSkillsController);

export default router;

import {
  createProblem,
  getAllOpenProblems,
  getUserProblems,
  markProblemAsFixed,
  findProblemById,
  deleteProblem,
  getAllProblems
} from "../models/problemModel.js";

export const postProblem = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description required" });
    }

    const problem = await createProblem({
      user_id: req.user.id, // From authMiddleware
      title,
      description,
    });

    res.status(201).json(problem[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const listProblems = async (req, res) => {
  try {
    const problems = await getAllOpenProblems();
    res.json(problems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// LIST MY PROBLEMS
export const listMyProblems = async (req, res) => {
  try {
    const problems = await getUserProblems(req.user.id);
    res.json(problems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// MARK AS FIXED
export const fixProblem = async (req, res) => {
  try {
    const problemId = req.params.id;

    const problem = await findProblemById(problemId);

    if (!problem) return res.status(404).json({ message: "Problem not found" });

    if (problem.user_id !== req.user.id) {
      return res.status(403).json({ message: "Not your problem" });
    }

    const updatedProblem = await markProblemAsFixed(problemId);
    res.json(updatedProblem[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE PROBLEM
export const removeProblem = async (req, res) => {
  try {
    const problemId = req.params.id;

    const problem = await findProblemById(problemId);
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    if (problem.user_id !== req.user.id) {
      return res.status(403).json({ message: "Not your problem" });
    }

    await deleteProblem(problemId);

    res.json({ message: "Problem deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// LIST ALL PROBLEMS (even fixed)
export const listAllProblems = async (req, res) => {
  try {
    const problems = await getAllProblems();
    res.json(problems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
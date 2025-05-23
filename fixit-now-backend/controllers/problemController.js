import {
  createProblem,
  getAllOpenProblems,
  getUserProblems,
  markProblemAsFixed,
  findProblemById,
  deleteProblem,
  getAllProblems,
  updateProblemMedia,
  getAllProblemsWithOwner,
} from "../models/problemModel.js";

// ─────────────── POST: Create a new problem ───────────────
export const postProblem = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description required" });
    }

    const [problem] = await createProblem({
      user_id: req.user.id,
      title,
      description,
    });

    res.status(201).json(problem);
  } catch (err) {
    console.error("postProblem error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────── GET: All open problems (for providers) ───────────────
export const listProblems = async (req, res) => {
  try {
    const problems = await getAllOpenProblems();
    res.json(problems);
  } catch (err) {
    console.error("listProblems error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────── GET: All problems of logged-in user ───────────────
export const listMyProblems = async (req, res) => {
  try {
    const problems = await getUserProblems(req.user.id);
    res.json(problems);
  } catch (err) {
    console.error("listMyProblems error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────── PATCH: Mark problem as fixed ───────────────
export const fixProblem = async (req, res) => {
  try {
    const problemId = req.params.id;
    const problem = await findProblemById(problemId);

    if (!problem) return res.status(404).json({ message: "Problem not found" });
    if (problem.user_id !== req.user.id) {
      return res.status(403).json({ message: "Not your problem" });
    }

    const [updatedProblem] = await markProblemAsFixed(problemId);
    res.json(updatedProblem);
  } catch (err) {
    console.error("fixProblem error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────── DELETE: Remove a problem ───────────────
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
    console.error("removeProblem error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────── GET: All problems (even fixed) ───────────────
export const listAllProblems = async (req, res) => {
  try {
    const problems = await getAllProblemsWithOwner();
    const result = problems.map((p) => ({
      ...p,
      owner: {
        id: p.owner_id,
        username: p.owner_username,
        email: p.owner_email,
      },
    }));
    res.json(result);
  } catch (err) {
    console.error("listAllProblems error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────── PATCH: Upload media for a problem ───────────────
export const uploadProblemMedia = async (req, res) => {
  try {
    const problemId = req.params.id;
    const problem = await findProblemById(problemId);
    if (!problem) return res.status(404).json({ message: "Problem not found" });
    if (problem.user_id !== req.user.id) {
      return res.status(403).json({ message: "Not your problem" });
    }
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const fileUrl = `/uploads/${req.file.filename}`;
    const media = Array.isArray(problem.media) ? problem.media : [];
    media.push(fileUrl);
    await updateProblemMedia(problemId, media);
    res.json({ media });
  } catch (err) {
    console.error("uploadProblemMedia error:", err);
    res.status(500).json({ message: "Failed to upload media" });
  }
};

// ─────────────── DELETE: Remove media from a problem ───────────────
export const removeProblemMedia = async (req, res) => {
  try {
    const problemId = req.params.id;
    const { fileUrl } = req.body;
    const problem = await findProblemById(problemId);
    if (!problem) return res.status(404).json({ message: "Problem not found" });
    if (problem.user_id !== req.user.id) {
      return res.status(403).json({ message: "Not your problem" });
    }
    const media = (Array.isArray(problem.media) ? problem.media : []).filter(
      (url) => url !== fileUrl
    );
    await updateProblemMedia(problemId, media);
    res.json({ media });
  } catch (err) {
    console.error("removeProblemMedia error:", err);
    res.status(500).json({ message: "Failed to remove media" });
  }
};

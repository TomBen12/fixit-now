import fetch from "node-fetch";
import getToken from "./token.js";

const API = "http://localhost:5001/api/problems";

let token;
let problemId;

async function createProblem() {
  const res = await fetch(`${API}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title: "Oven broken", description: "Doesn't heat" }),
  });
  const data = await res.json();
  console.log("Created Problem:", data);
  problemId = data.id;
}

async function listProblems() {
  const res = await fetch(`${API}`);
  const data = await res.json();
  console.log("List Problems:", data);
}

async function markAsFixed() {
  const res = await fetch(`${API}/${problemId}/fix`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  console.log("Marked As Fixed:", data);
}

async function deleteProblem() {
  const res = await fetch(`${API}/${problemId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  console.log("Deleted Problem:", data);
}

async function run() {
  token = await getToken();

  await createProblem();
  await listProblems();
  await markAsFixed();
  await deleteProblem();
}

run();

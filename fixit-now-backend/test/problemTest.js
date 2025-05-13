import fetch from "node-fetch";
import { getClientToken } from "./token.js";
import dotenv from "dotenv";
dotenv.config();

const BASE_URL = "http://localhost:5001/api/problems";

async function runProblemTests() {
  const token = await getClientToken();
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  try {
    // 1. Post a new problem
    const createRes = await fetch(`${BASE_URL}`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        title: "Oven is broken",
        description: "The oven stopped heating after 5 minutes.",
      }),
    });
    const created = await createRes.json();
    console.log("Problem created:", created);

    // 2. List open problems (public)
    const listRes = await fetch(`${BASE_URL}`);
    const list = await listRes.json();
    console.log("Open problems:", list);

    // 3. List my problems
    const myRes = await fetch(`${BASE_URL}/mine`, { headers });
    const mine = await myRes.json();
    console.log("My problems:", mine);
  } catch (err) {
    console.error("Problem test error:", err);
  }
}

runProblemTests();

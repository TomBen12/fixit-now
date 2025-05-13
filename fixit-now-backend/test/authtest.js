import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const BASE_URL = "http://localhost:5001/api/auth";

async function runAuthTest() {
  try {
    const res = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "client",
        email: "client@example.com",
        password: "1234",
      }),
    });

    const data = await res.json();
    console.log("Registered:", data);

    const loginRes = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "client@example.com",
        password: "1234",
      }),
    });

    const loginData = await loginRes.json();
    console.log("Logged in:", loginData);
  } catch (err) {
    console.error("Auth test error:", err);
  }
}

runAuthTest();

import fetch from "node-fetch";
import { getClientToken, getProviderToken } from "./token.js";
import dotenv from "dotenv";
dotenv.config();

const BASE_URL = "http://localhost:5001/api/chats";
const PROBLEM_BASE = "http://localhost:5001/api/problems";

async function runChatTest() {
  const clientToken = await getClientToken();
  const providerToken = await getProviderToken();

  const clientHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${clientToken}`,
  };
  const providerHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${providerToken}`,
  };

  try {
    // Fetch client's problems
    const res = await fetch(`${PROBLEM_BASE}/mine`, { headers: clientHeaders });
    const problems = await res.json();
    if (!problems.length) throw new Error("No problems to chat on.");

    const problemId = problems[0].id;

    // Start chat as provider
    const startRes = await fetch(`${BASE_URL}`, {
      method: "POST",
      headers: providerHeaders,
      body: JSON.stringify({ problem_id: problemId }),
    });
    const chat = await startRes.json();
    console.log("Started Chat:", chat);

    // Get chats for that problem as client
    const chatsRes = await fetch(`${BASE_URL}/problem/${problemId}`, {
      headers: clientHeaders,
    });
    const chats = await chatsRes.json();
    console.log("Chats of Problem:", chats);

    // Get messages in chat
    if (chat?.id) {
      const messagesRes = await fetch(`${BASE_URL}/${chat.id}/messages`, {
        headers: providerHeaders,
      });
      const messages = await messagesRes.json();
      console.log("🗨️  Chat Messages:", messages);
    }
  } catch (err) {
    console.error("Chat test error:", err);
  }
}

runChatTest();

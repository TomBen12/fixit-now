// socketMediaTest.js
import { io } from "socket.io-client";
import { getClientToken, getProviderToken } from "./token.js";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const SOCKET_URL = "http://localhost:5001";
const PROBLEM_API = "http://localhost:5001/api/problems";
const CHAT_API = "http://localhost:5001/api/chats";

async function getChatId(providerToken, problemId) {
  const res = await fetch(`${CHAT_API}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${providerToken}`,
    },
    body: JSON.stringify({ problem_id: problemId }),
  });
  const data = await res.json();
  return data?.id;
}

async function start() {
  const clientToken = await getClientToken();
  const providerToken = await getProviderToken();

  const problemRes = await fetch(`${PROBLEM_API}/mine`, {
    headers: { Authorization: `Bearer ${clientToken}` },
  });
  const problems = await problemRes.json();
  if (!problems.length) return console.error("No problems found.");

  const problemId = problems[0].id;
  const chatId = await getChatId(providerToken, problemId);
  if (!chatId) return console.error("Chat creation failed.");

  const socket = io(SOCKET_URL);
  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);
    socket.emit("joinChat", chatId);

    const mediaMessage = {
      chat_id: chatId,
      from_user_id: 2, // Replace with dynamic user ID if possible
      content: "Here is the video",
      file_url: "/uploads/sample-video.mp4", // Ensure this file exists server-side
    };

    socket.emit("chat:message", mediaMessage);
  });

  socket.on("chat:message", (msg) => {
    console.log("📨 Media message received:", msg);
    socket.disconnect();
  });
}

start();

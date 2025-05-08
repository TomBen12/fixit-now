import fetch from "node-fetch";
import getToken from "./token.js";

const API = "http://localhost:5001/api/chats";

let token;
let chatId;
const problemId = 1; // CHANGE TO EXISTING PROBLEM ID

async function startChat() {
  const res = await fetch(`${API}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ problem_id: problemId }),
  });
  const data = await res.json();
  console.log("Started Chat:", data);
  chatId = data.id;
}

async function getChatsOfProblem() {
  const res = await fetch(`${API}/problem/${problemId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  console.log("Chats of Problem:", data);
}

async function getChatMessages() {
  const res = await fetch(`${API}/${chatId}/messages`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  console.log("Chat Messages:", data);
}

async function run() {
  token = await getToken();

  await startChat();
  await getChatsOfProblem();
  await getChatMessages();
}

run();

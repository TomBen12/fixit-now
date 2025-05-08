import { io } from "socket.io-client";
import fetch from "node-fetch";
import getToken from "./token.js";

const problemId = 1; // CHANGE to the real problem id

async function getChatId(token) {
  const res = await fetch(
    `http://localhost:5001/api/chats/problem/${problemId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  const chats = await res.json();
  return chats[0].id;
}

async function start() {
  const token = await getToken();
  const chatId = await getChatId(token);

  const socket = io("http://localhost:5001");

  socket.on("connect", () => {
    console.log("Connected:", socket.id);

    socket.emit("joinChat", chatId);
    console.log(`Joined Chat Room: ${chatId}`);

    socket.emit("chat:message", {
      chat_id: chatId,
      from_user_id: 2, // CHANGE current user id
      content: "Hello from backend socket test!",
    });
  });

  socket.on("chat:message", (message) => {
    console.log("Received Message:", message);
  });
}

start();

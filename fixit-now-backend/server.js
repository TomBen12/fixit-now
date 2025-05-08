import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import { initSocket } from "./socket/socket.js";

import authRoutes from "./routes/authRoutes.js";
import problemRoutes from "./routes/problemRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";


dotenv.config();

const app = express();
const server = http.createServer(app); // Create HTTP server for socket.io

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Initialize Socket.io
initSocket(io);

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/chats", chatRoutes);

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

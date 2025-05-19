import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";

import { initSocket } from "./socket/socket.js";
import authRoutes from "./routes/authRoutes.js";
import problemRoutes from "./routes/problemRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // In production, replace this with your frontend origin
  },
});

initSocket(io);
console.log("--Socket.IO initialized--");

// === Middlewares ===
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL for local development
    credentials: true,
  })
);
app.use("/uploads", express.static("uploads")); // Serve media files

// === Routes ===
app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/chats", chatRoutes);

// Basic API health check
app.get("/", (req, res) => {
  res.send("FixIt Now API is running");
});

// === Start Server ===
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

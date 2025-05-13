import { createMessage } from "../models/chatModel.js";

export const initSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("---User connected:", socket.id);

    // ─────────────── Join a chatroom ───────────────
    socket.on("joinChat", (chat_id) => {
      socket.join(chat_id);
      console.log(`👥 User joined chat room ${chat_id}`);
    });

    // ─────────────── Receive + Save + Broadcast Message ───────────────
    socket.on("chat:message", async (data) => {
      try {
        const { chat_id, from_user_id, content, file_url } = data;

        if (!chat_id || !from_user_id || (!content && !file_url)) {
          console.warn("Invalid chat message:", data);
          return;
        }

        const [savedMessage] = await createMessage({
          chat_id,
          from_user_id,
          content,
          file_url,
        });

        // Emit message to everyone in the same chat room
        io.to(chat_id).emit("chat:message", savedMessage);
      } catch (err) {
        console.error("Socket message error:", err);
        socket.emit("chat:error", { message: "Failed to send message" });
      }
    });

    // ─────────────── Handle Disconnect ───────────────
    socket.on("disconnect", () => {
      console.log("--- User disconnected:", socket.id);
    });
  });
};

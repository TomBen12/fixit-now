import { createMessage } from "../models/chatModel.js";

export const initSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join chatroom
    socket.on("joinChat", (chat_id) => {
      socket.join(chat_id);
      console.log(`User joined chat ${chat_id}`);
    });

    // Receive and broadcast message
    socket.on("chat:message", async (data) => {
      const { chat_id, from_user_id, content } = data;

      // Save message to DB
      const [savedMessage] = await createMessage({
        chat_id,
        from_user_id,
        content,
      });

      // Broadcast to other users in room
      io.to(chat_id).emit("chat:message", savedMessage);
    });

    // User disconnected
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

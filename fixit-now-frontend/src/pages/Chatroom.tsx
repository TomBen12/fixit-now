import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store/index";
import { MdSend, MdImage, MdUpload } from "react-icons/md";
import { io, Socket } from "socket.io-client";
import "./MyProblems.css";

const API_URL = import.meta.env.VITE_API_URL || "";

interface Message {
  id: number;
  chat_id: number;
  from_user_id: number;
  content: string | null;
  file_url: string | null;
  created_at: string;
}

interface ChatroomInfo {
  problem_title: string;
  other_user: {
    id: number;
    username: string;
    email: string;
  };
}

// Only create one socket instance for the app
const socket: Socket = io(API_URL, {
  withCredentials: true,
  transports: ["websocket"],
});

const Chatroom: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const user = useSelector((state: RootState) => state.auth.user);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInfo, setChatInfo] = useState<ChatroomInfo | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch chat info and messages (REST, for initial load)
  useEffect(() => {
    if (!chatId) return;
    setLoading(true);
    Promise.all([
      fetch(`${API_URL}/api/chats/${chatId}/messages`, {
        credentials: "include",
      }).then((res) => res.json()),
      fetch(`${API_URL}/api/chats/user`, { credentials: "include" }).then(
        (res) => res.json()
      ),
    ])
      .then(([msgs, chats]) => {
        setMessages(msgs);
        // Find chat info for this chatId
        const chat = chats.find((c: any) => c.id === Number(chatId));
        if (chat) {
          setChatInfo({
            problem_title: chat.problem_title,
            other_user: chat.other_user,
          });
        }
        // Mark all messages as read when chatroom is opened
        fetch(`${API_URL}/api/chats/${chatId}/read`, {
          method: "PATCH",
          credentials: "include",
        });
      })
      .catch(() => setError("Failed to load chatroom"))
      .finally(() => setLoading(false));
  }, [chatId]);

  // Socket.IO: join chatroom and listen for new messages
  useEffect(() => {
    if (!chatId || !user) return;
    socket.emit("joinChat", Number(chatId));
    const handleSocketMessage = (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    };
    socket.on("chat:message", handleSocketMessage);
    return () => {
      socket.off("chat:message", handleSocketMessage);
      socket.emit("leaveChat", Number(chatId));
    };
  }, [chatId, user]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message (via socket, fallback to REST if needed)
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user) return;
    setLoading(true);
    // Emit message via socket
    socket.emit("chat:message", {
      chat_id: Number(chatId),
      from_user_id: user.id,
      content: input,
      file_url: null,
    });
    setInput("");
    setLoading(false);
    // Mark as read after sending (to keep unread count in sync)
    fetch(`${API_URL}/api/chats/${chatId}/read`, {
      method: "PATCH",
      credentials: "include",
    });
  };

  return (
    <div className="myproblems-container" style={{ maxWidth: 600 }}>
      <div className="myproblems-header" style={{ marginBottom: 0 }}>
        <div>
          <h1 style={{ fontSize: "1.3rem", marginBottom: 2 }}>
            {chatInfo?.problem_title || "Chatroom"}
          </h1>
          <p style={{ fontSize: "1rem", color: "#888" }}>
            With:{" "}
            {chatInfo?.other_user?.username || chatInfo?.other_user?.email}
          </p>
        </div>
      </div>
      <div
        style={{
          background: "#f7fafc",
          borderRadius: 10,
          minHeight: 320,
          maxHeight: 420,
          overflowY: "auto",
          padding: "1.2rem 1rem 0.5rem 1rem",
          margin: "1.2rem 0 1rem 0",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              alignSelf:
                msg.from_user_id === user?.id ? "flex-end" : "flex-start",
              background: msg.from_user_id === user?.id ? "#ff6b00" : "#fff",
              color: msg.from_user_id === user?.id ? "#fff" : "#222",
              borderRadius: 8,
              padding: msg.file_url ? 0 : "0.5em 1em",
              marginBottom: 8,
              maxWidth: 320,
              wordBreak: "break-word",
              boxShadow: "0 1px 4px rgba(20,40,80,0.06)",
              fontSize: 15,
              position: "relative",
            }}
          >
            {msg.file_url ? (
              msg.file_url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                <img
                  src={msg.file_url}
                  alt="media"
                  style={{ maxWidth: 220, borderRadius: 6 }}
                />
              ) : msg.file_url.match(/\.(mp4|mov|avi)$/i) ? (
                <video
                  src={msg.file_url}
                  controls
                  style={{ maxWidth: 220, borderRadius: 6 }}
                />
              ) : null
            ) : (
              msg.content
            )}
            <div
              style={{
                fontSize: 11,
                color: msg.from_user_id === user?.id ? "#ffe3d0" : "#aaa",
                marginTop: 2,
                textAlign: "right",
              }}
            >
              {new Date(msg.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} style={{ display: "flex", gap: 8 }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          style={{
            flex: 1,
            borderRadius: 6,
            border: "1px solid #e4e8eb",
            padding: "0.7em 1em",
            fontSize: 15,
          }}
          disabled={loading}
        />
        <button
          type="submit"
          className="myproblems-create-btn"
          style={{
            minWidth: 44,
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          disabled={loading || !input.trim()}
        >
          <MdSend size={22} />
        </button>
      </form>
      {error && <div className="myproblems-error">{error}</div>}
    </div>
  );
};

export default Chatroom;

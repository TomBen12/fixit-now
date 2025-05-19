import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdChatBubble } from "react-icons/md";
import "./MyProblems.css";

const API_URL = import.meta.env.VITE_API_URL || "";

interface Chatroom {
  id: number;
  problem_title: string;
  other_user: {
    id: number;
    username: string;
    email: string;
  };
  unread_count: number;
}

const Messages: React.FC = () => {
  const [chatrooms, setChatrooms] = useState<Chatroom[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/chats/mine`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setChatrooms(data))
      .catch(() => setError("Failed to load chatrooms"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="myproblems-container">
      <div className="myproblems-header">
        <div>
          <h1>Messages</h1>
          <p>All your chatrooms related to problems.</p>
        </div>
      </div>
      {loading && <div>Loading...</div>}
      {error && <div className="myproblems-error">{error}</div>}
      <div className="myproblems-list">
        {chatrooms.length === 0 && !loading ? (
          <div className="myproblems-empty">
            <MdChatBubble size={48} />
            <h3>No chatrooms yet</h3>
            <p>Start a conversation from the Problem Board!</p>
          </div>
        ) : (
          chatrooms.map((chat) => (
            <div
              key={chat.id}
              className="myproblems-item"
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              onClick={() => navigate(`/chat/${chat.id}`)}
            >
              <div>
                <div style={{ fontWeight: 600, color: "#1a2a44" }}>
                  {chat.problem_title}
                </div>
                <div style={{ color: "#888", fontSize: "0.97em" }}>
                  With: {chat.other_user.username || chat.other_user.email}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {chat.unread_count > 0 && (
                  <span
                    style={{
                      background: "#ff6b00",
                      color: "#fff",
                      borderRadius: 12,
                      padding: "0.2em 0.7em",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    {chat.unread_count}
                  </span>
                )}
                <MdChatBubble size={22} color="#ff6b00" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Messages;

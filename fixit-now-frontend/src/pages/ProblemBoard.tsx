import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../store/index";
import { MdImage, MdChat } from "react-icons/md";
import "./ProblemBoard.css";

interface Problem {
  id: number;
  title: string;
  description: string;
  media: string[];
  is_fixed?: boolean;
  user_id: number;
  owner?: {
    id: number;
    username: string;
    email: string;
  };
}

const ProblemBoard: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch("/api/problems/board", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setProblems(data))
      .catch(() => setError("Failed to load problems"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="problemboard-container">
      <div className="problemboard-header">
        <div>
          <h1>Problem Board</h1>
          <p>Browse all problems and help others by initiating a chat.</p>
        </div>
      </div>
      {loading && <div>Loading...</div>}
      {error && <div className="problemboard-error">{error}</div>}
      <div className="problemboard-list">
        {problems.length === 0 && !loading ? (
          <div className="problemboard-empty">
            <MdImage size={48} />
            <h3>No problems found</h3>
            <p>Check back later or create a new problem!</p>
          </div>
        ) : (
          problems.map((problem) => (
            <div
              key={problem.id}
              className={`problemboard-item${problem.is_fixed ? " fixed" : ""}`}
            >
              <div className="problemboard-item-header">
                <h3>{problem.title}</h3>
                {problem.is_fixed && (
                  <span className="problemboard-fixed-badge">Fixed</span>
                )}
              </div>
              <p>{problem.description}</p>
              <div className="problemboard-media-list">
                {problem.media && problem.media.length > 0 ? (
                  problem.media.map((url) => (
                    <div key={url} className="problemboard-media-item">
                      {url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                        <img src={url} alt="media" />
                      ) : url.match(/\.(mp4|mov|avi)$/i) ? (
                        <video src={url} controls />
                      ) : null}
                    </div>
                  ))
                ) : (
                  <div
                    className="problemboard-no-media"
                    style={{ color: "#bbb", fontSize: "0.95em" }}
                  >
                    <MdImage size={20} /> No media
                  </div>
                )}
              </div>
              <div
                style={{
                  margin: "0.5rem 0 0.5rem 0",
                  color: "#888",
                  fontSize: "0.95em",
                }}
              >
                <span>
                  Owner:{" "}
                  {problem.owner?.username ||
                    problem.owner?.email ||
                    problem.user_id}
                </span>
              </div>
              {user && user.id !== problem.user_id && (
                <button
                  className="problemboard-chat-btn"
                  style={{
                    width: "100%",
                    marginTop: "0.5rem",
                    justifyContent: "center",
                  }}
                  onClick={async () => {
                    try {
                      const res = await fetch("/api/chats", {
                        method: "POST",
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ problem_id: problem.id }),
                      });
                      if (res.ok) {
                        const chat = await res.json();
                        navigate(`/chat/${chat.id}`);
                      } else {
                        alert("Failed to start or find chatroom");
                      }
                    } catch {
                      alert("Failed to start or find chatroom");
                    }
                  }}
                >
                  <MdChat size={18} style={{ marginRight: 4 }} /> Initiate Chat
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProblemBoard;

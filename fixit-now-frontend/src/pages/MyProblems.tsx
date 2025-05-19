import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/index";
import {
  MdAdd,
  MdDelete,
  MdCheck,
  MdImage,
  MdUpload,
  MdClose,
} from "react-icons/md";
import "./MyProblems.css";

interface Problem {
  id: number;
  title: string;
  description: string;
  media: string[];
  is_fixed?: boolean;
}

const MyProblems: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<"image" | "video" | null>(
    null
  );

  // Fetch user's problems
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetch("/api/problems/mine", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setProblems(data))
      .catch(() => setError("Failed to load problems"))
      .finally(() => setLoading(false));
  }, [user]);

  // Create a new problem
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!title || !description) {
      setError("Title and description are required");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/problems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, description }),
      });
      if (!res.ok) throw new Error("Failed to create problem");
      const newProblem = await res.json();
      setProblems((prev) => [newProblem, ...prev]);
      setTitle("");
      setDescription("");
      setFile(null);
      setFiles(null);
      setSuccess("Problem created!");
      setIsFormOpen(false);
      // If files are selected, upload them all
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          await handleUploadMedia(newProblem.id, files[i]);
        }
      } else if (file) {
        await handleUploadMedia(newProblem.id, file);
      }
    } catch {
      setError("Failed to create problem");
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(""), 2000);
    }
  };

  // Upload media to a problem
  const handleUploadMedia = async (problemId: number, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    try {
      const res = await fetch(`/api/problems/${problemId}/media`, {
        method: "PATCH",
        credentials: "include",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to upload media");
      const { media } = await res.json();
      setProblems((prev) =>
        prev.map((p) => (p.id === problemId ? { ...p, media } : p))
      );
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      setError("Failed to upload media");
    } finally {
      setLoading(false);
    }
  };

  // Remove media from a problem
  const handleRemoveMedia = async (problemId: number, fileUrl: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/problems/${problemId}/media`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileUrl }),
      });
      if (!res.ok) throw new Error("Failed to remove media");
      const { media } = await res.json();
      setProblems((prev) =>
        prev.map((p) => (p.id === problemId ? { ...p, media } : p))
      );
    } catch {
      setError("Failed to remove media");
    } finally {
      setLoading(false);
    }
  };

  // Mark as fixed
  const handleSetFixed = async (problemId: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/problems/${problemId}/fix`, {
        method: "PUT",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to set as fixed");
      setProblems((prev) =>
        prev.map((p) => (p.id === problemId ? { ...p, is_fixed: true } : p))
      );
    } catch {
      setError("Failed to set as fixed");
    } finally {
      setLoading(false);
    }
  };

  // Delete a problem
  const handleDelete = async (problemId: number) => {
    if (!window.confirm("Are you sure you want to delete this problem?"))
      return;
    setLoading(true);
    try {
      const res = await fetch(`/api/problems/${problemId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete problem");
      setProblems((prev) => prev.filter((p) => p.id !== problemId));
    } catch {
      setError("Failed to delete problem");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="myproblems-container">
      <div className="myproblems-header">
        <div>
          <h1>My Problems</h1>
          <p>Create and manage your problems here</p>
        </div>
        <button
          className="myproblems-create-btn"
          onClick={() => setIsFormOpen(!isFormOpen)}
        >
          <MdAdd size={20} />
          New Problem
        </button>
      </div>

      {isFormOpen && (
        <form className="myproblems-form" onSubmit={handleCreate}>
          <div className="myproblems-form-header">
            <h2>Create New Problem</h2>
            <button
              type="button"
              className="myproblems-form-close"
              onClick={() => setIsFormOpen(false)}
            >
              ×
            </button>
          </div>
          <div className="myproblems-form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              placeholder="What's the problem?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="myproblems-form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              placeholder="Describe your problem in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="myproblems-form-group">
            <label htmlFor="media">Media (Optional)</label>
            <div className="myproblems-file-input">
              <input
                id="media"
                type="file"
                accept="image/*,video/*"
                multiple
                ref={fileInputRef}
                onChange={(e) => {
                  setFiles(e.target.files);
                  setFile(e.target.files?.[0] || null);
                }}
              />
              <MdImage size={20} />
              <span>
                {files && files.length > 0
                  ? Array.from(files)
                      .map((f) => f.name)
                      .join(", ")
                  : file
                  ? file.name
                  : "Choose files"}
              </span>
            </div>
          </div>
          <div className="myproblems-form-actions">
            <button
              type="submit"
              className="myproblems-submit"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Problem"}
            </button>
            {success && <span className="myproblems-success">{success}</span>}
            {error && <span className="myproblems-error">{error}</span>}
          </div>
        </form>
      )}

      <div className="myproblems-list">
        {problems.length === 0 ? (
          <div className="myproblems-empty">
            <MdImage size={48} />
            <h3>No problems yet</h3>
            <p>Create your first problem to get started</p>
          </div>
        ) : (
          problems.map((problem) => (
            <div
              key={problem.id}
              className={`myproblems-item ${problem.is_fixed ? "fixed" : ""}`}
            >
              <div className="myproblems-item-header">
                <h3>{problem.title}</h3>
                {problem.is_fixed && (
                  <span className="myproblems-fixed-badge">
                    <MdCheck size={16} />
                    Fixed
                  </span>
                )}
              </div>
              <p>{problem.description}</p>
              <div className="myproblems-media-list">
                {problem.media &&
                  problem.media.length > 0 &&
                  problem.media.map((url) => {
                    const isImage = url.match(/\.(jpg|jpeg|png|gif)$/i);
                    const isVideo = url.match(/\.(mp4|mov|avi)$/i);
                    return (
                      <div key={url} className="myproblems-media-item">
                        {isImage ? (
                          <img
                            src={url}
                            alt="media"
                            onClick={() => {
                              setPreviewUrl(url);
                              setPreviewType("image");
                            }}
                            style={{ cursor: "pointer" }}
                          />
                        ) : isVideo ? (
                          <video
                            src={url}
                            controls
                            onClick={() => {
                              setPreviewUrl(url);
                              setPreviewType("video");
                            }}
                            style={{ cursor: "pointer" }}
                          />
                        ) : null}
                        <div
                          style={{
                            display: "flex",
                            gap: "0.5rem",
                            marginTop: "0.5rem",
                          }}
                        >
                          <button
                            type="button"
                            className="myproblems-remove-media"
                            onClick={() => handleRemoveMedia(problem.id, url)}
                            disabled={loading}
                          >
                            Remove
                          </button>
                          <label className="myproblems-add-media-inline">
                            <input
                              type="file"
                              accept="image/*,video/*"
                              multiple
                              style={{ display: "none" }}
                              onChange={(e) => {
                                if (
                                  e.target.files &&
                                  e.target.files.length > 0
                                ) {
                                  Array.from(e.target.files).forEach((file) => {
                                    handleUploadMedia(problem.id, file);
                                  });
                                }
                              }}
                              disabled={loading}
                            />
                            <MdUpload size={16} /> Add Media
                          </label>
                        </div>
                      </div>
                    );
                  })}
              </div>
              <div className="myproblems-actions">
                {!problem.is_fixed && (
                  <button
                    type="button"
                    className="myproblems-fix-btn"
                    onClick={() => handleSetFixed(problem.id)}
                    disabled={loading}
                  >
                    <MdCheck size={16} />
                    Mark as Fixed
                  </button>
                )}
                <button
                  type="button"
                  className="myproblems-delete-btn"
                  onClick={() => handleDelete(problem.id)}
                  disabled={loading}
                >
                  <MdDelete size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Media Preview Modal */}
      {previewUrl && (
        <div
          className="myproblems-media-modal"
          onClick={() => setPreviewUrl(null)}
        >
          <div
            className="myproblems-media-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="myproblems-media-modal-close"
              onClick={() => setPreviewUrl(null)}
            >
              <MdClose size={28} />
            </button>
            {previewType === "image" ? (
              <img src={previewUrl} alt="preview" />
            ) : previewType === "video" ? (
              <video
                src={previewUrl}
                controls
                autoPlay
                style={{ maxHeight: "80vh", maxWidth: "90vw" }}
              />
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProblems;

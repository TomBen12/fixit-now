import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser, setLoading, setError } from "../store/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const API_URL = import.meta.env.VITE_API_URL || "";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [localError, setLocalError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    try {
      dispatch(setLoading(true));
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLocalError(data.message || "Login failed");
        dispatch(setError(data.message || "Login failed"));
        return;
      }
      dispatch(setUser(data.user));
      navigate("/dashboard");
    } catch (error) {
      setLocalError("Login failed. Please try again.");
      dispatch(setError("Login failed. Please try again."));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="modern-auth-bg">
      <nav className="modern-navbar">
        <Link to="/" className="modern-navbar-brand">
          FixIt Now
        </Link>
        <Link to="/register" className="modern-navbar-link">
          Register
        </Link>
      </nav>

      <div className="modern-auth-container">
        <div className="modern-auth-card">
          <h1 className="modern-auth-title">Welcome Back</h1>
          <p className="modern-auth-subtitle">
            Log in to continue solving problems
          </p>

          {localError && (
            <div
              style={{
                color: "#e53e3e",
                marginBottom: "1rem",
                textAlign: "center",
              }}
            >
              {localError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="modern-auth-form">
            <div className="modern-form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="modern-form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
              />
            </div>

            <button type="submit" className="modern-auth-submit">
              Log In
            </button>
          </form>

          <p className="modern-auth-switch">
            Don't have an account?{" "}
            <Link to="/register" className="modern-auth-link">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

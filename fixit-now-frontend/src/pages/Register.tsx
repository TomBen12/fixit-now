import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser, setLoading, setError } from "../store/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [localError, setLocalError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    if (formData.password !== formData.confirmPassword) {
      setLocalError("Passwords do not match");
      dispatch(setError("Passwords do not match"));
      return;
    }
    try {
      dispatch(setLoading(true));
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLocalError(data.message || "Registration failed");
        dispatch(setError(data.message || "Registration failed"));
        return;
      }
      dispatch(setUser(data.user));
      navigate("/dashboard");
    } catch (error) {
      setLocalError("Registration failed. Please try again.");
      dispatch(setError("Registration failed. Please try again."));
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
        <Link to="/login" className="modern-navbar-link">
          Log in
        </Link>
      </nav>

      <div className="modern-auth-container">
        <div className="modern-auth-card">
          <h1 className="modern-auth-title">Create Account</h1>
          <p className="modern-auth-subtitle">
            Join our community of problem solvers
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
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Enter your username"
              />
            </div>

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
                placeholder="Create a password"
              />
            </div>

            <div className="modern-form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
              />
            </div>

            <button type="submit" className="modern-auth-submit">
              Create Account
            </button>
          </form>

          <p className="modern-auth-switch">
            Already have an account?{" "}
            <Link to="/login" className="modern-auth-link">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

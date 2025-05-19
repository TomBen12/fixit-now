import React from "react";
import { Link } from "react-router-dom";
import { MdFlashOn, MdLock, MdChatBubble } from "react-icons/md";
import "./Landing.css";

const Landing = () => {
  return (
    <div className="modern-landing-bg">
      <div className="modern-landing-container">
        <header className="modern-navbar">
          <div className="modern-navbar-brand">FixIt Now</div>
          <div className="modern-navbar-actions">
            <Link to="/login" className="modern-nav-btn modern-nav-login">
              Login
            </Link>
            <Link to="/register" className="modern-nav-btn modern-nav-register">
              Register
            </Link>
          </div>
        </header>

        <main className="modern-main-content">
          <section className="modern-hero modern-hero-centered">
            <div className="modern-hero-content">
              <h1 className="modern-hero-title">
                Get Help Instantly,{" "}
                <span className="modern-hero-accent">Solve Anything</span>
              </h1>
              <p className="modern-hero-subtitle">
                Connect with top experts in real-time. Fast, secure, and
                reliable solutions for your toughest problems.
              </p>
              <Link to="/register" className="modern-hero-cta">
                Get Started
              </Link>
            </div>
          </section>

          <section className="modern-features">
            <div className="modern-feature-card">
              <div className="modern-feature-icon">
                <MdFlashOn size={38} color="#FF6B00" />
              </div>
              <h3>Instant Matching</h3>
              <p>Get connected to the right expert in seconds.</p>
            </div>
            <div className="modern-feature-card">
              <div className="modern-feature-icon">
                <MdLock size={38} color="#1A2A44" />
              </div>
              <h3>Secure & Private</h3>
              <p>Your data and conversations are always protected.</p>
            </div>
            <div className="modern-feature-card">
              <div className="modern-feature-icon">
                <MdChatBubble size={38} color="#FF6B00" />
              </div>
              <h3>Real-Time Chat</h3>
              <p>Collaborate and solve problems live with experts.</p>
            </div>
          </section>

          <section className="modern-final-cta">
            <h2>Ready to solve your next problem?</h2>
            <Link to="/register" className="modern-final-cta-btn">
              Join Now
            </Link>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Landing;

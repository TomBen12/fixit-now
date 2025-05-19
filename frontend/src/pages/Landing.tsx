import React from "react";
import { Link } from "react-router-dom";
import {
  MdFlashOn,
  MdLock,
  MdChatBubble,
  MdArrowForward,
} from "react-icons/md";
import "./Landing.css";

const Landing = () => {
  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="nav-content">
          <div className="nav-brand">
            <span className="brand-text">FixIt Now</span>
          </div>
          <div className="nav-actions">
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/register" className="nav-button">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main>
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              Professional Solutions
              <span className="accent-text">At Your Fingertips</span>
            </h1>
            <p className="hero-subtitle">
              Connect with expert problem-solvers instantly. Fast, secure, and
              reliable solutions for your toughest challenges.
            </p>
            <div className="hero-cta">
              <Link to="/register" className="primary-button">
                Start Solving Now
                <MdArrowForward className="button-icon" />
              </Link>
            </div>
          </div>
        </section>

        <section className="features-section">
          <div className="section-header">
            <h2>Why Choose FixIt Now?</h2>
            <p>Experience the future of problem-solving</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <MdFlashOn size={32} />
              </div>
              <h3>Lightning Fast</h3>
              <p>Get connected to the perfect expert in seconds, not days</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <MdLock size={32} />
              </div>
              <h3>Enterprise Security</h3>
              <p>
                Bank-grade encryption and privacy protection for all
                interactions
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <MdChatBubble size={32} />
              </div>
              <h3>Real-Time Collaboration</h3>
              <p>
                Seamless communication with instant messaging and file sharing
              </p>
            </div>
          </div>
        </section>

        <section className="how-it-works">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Three simple steps to solve any problem</p>
          </div>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Describe Your Problem</h3>
              <p>Share the details of what you need help with</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Get Matched</h3>
              <p>We'll connect you with the perfect expert</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Solve Together</h3>
              <p>Collaborate in real-time to find the solution</p>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-content">
            <h2>Ready to Transform Your Problem-Solving Experience?</h2>
            <p>
              Join thousands of satisfied users who have already found solutions
            </p>
            <Link to="/register" className="primary-button">
              Create Free Account
              <MdArrowForward className="button-icon" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">FixIt Now</div>
          <div className="footer-links">
            <Link to="/about">About</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div className="footer-copyright">
            © 2024 FixIt Now. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

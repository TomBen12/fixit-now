import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/index";
import { MdAssignment, MdMessage, MdSearch } from "react-icons/md";
import "./Dashboard.css";

const Dashboard = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <>
      <div className="dashboard-welcome">
        <h1>Hello, {user?.username}!</h1>
        <p>Welcome back to your dashboard. Here's what's happening today.</p>
      </div>

      <div className="dashboard-features">
        <div className="dashboard-feature-card">
          <div className="dashboard-feature-icon">
            <MdAssignment size={32} color="#1A2A44" />
          </div>
          <h3>Your Problems</h3>
          <p>View and manage the problems you've posted.</p>
        </div>
        <div className="dashboard-feature-card">
          <div className="dashboard-feature-icon">
            <MdMessage size={32} color="#FF6B00" />
          </div>
          <h3>Messages</h3>
          <p>Chat with experts and track your conversations.</p>
        </div>
        <div className="dashboard-feature-card">
          <div className="dashboard-feature-icon">
            <MdSearch size={32} color="#1A2A44" />
          </div>
          <h3>Problem Board</h3>
          <p>Browse all open problems and find something to help with.</p>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

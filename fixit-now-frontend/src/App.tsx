import React from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MyProblems from "./pages/MyProblems";
import DashboardLayout from "./components/DashboardLayout";
import ProblemBoard from "./pages/ProblemBoard";
import Messages from "./pages/Messages";
import Chatroom from "./pages/Chatroom";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-problems" element={<MyProblems />} />
          <Route path="/problem-board" element={<ProblemBoard />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/chat/:chatId" element={<Chatroom />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;

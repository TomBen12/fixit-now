import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import type { RootState } from "../store/index";
import { logout } from "../store/slices/authSlice";
import { MdDashboard, MdAssignment, MdMessage, MdSearch } from "react-icons/md";
import "./DashboardLayout.css";

const DashboardLayout = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadConversations, setUnreadConversations] = useState(0);

  useEffect(() => {
    // Fetch chatrooms for unread count
    fetch("/api/chats/mine", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setUnreadConversations(
          data.filter((c: any) => c.unread_count > 0).length
        );
      })
      .catch(() => setUnreadConversations(0));
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        dispatch(logout());
        navigate("/");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="dashboard-bg">
      <nav className="dashboard-navbar">
        <div className="dashboard-navbar-brand">FixIt Now</div>
        <button className="dashboard-navbar-logout" onClick={handleLogout}>
          Logout
        </button>
      </nav>

      <div className="dashboard-layout">
        {/* Side Menu */}
        <aside className="dashboard-sidebar">
          <div className="dashboard-user-info">
            <div className="dashboard-user-avatar">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="dashboard-user-details">
              <h3>{user?.username}</h3>
              <p>{user?.email}</p>
            </div>
          </div>

          <nav className="dashboard-menu">
            <button
              className={`dashboard-menu-item ${
                isActive("/dashboard") ? "active" : ""
              }`}
              onClick={() => navigate("/dashboard")}
            >
              <MdDashboard size={20} />
              Dashboard
            </button>
            <button
              className={`dashboard-menu-item ${
                isActive("/my-problems") ? "active" : ""
              }`}
              onClick={() => navigate("/my-problems")}
            >
              <MdAssignment size={20} />
              My Problems
            </button>
            <button
              className={`dashboard-menu-item ${
                isActive("/messages") ? "active" : ""
              }`}
              onClick={() => navigate("/messages")}
            >
              <MdMessage size={20} />
              Messages
              {unreadConversations > 0 && (
                <span
                  style={{
                    background: "#ff6b00",
                    color: "#fff",
                    borderRadius: 12,
                    padding: "0.1em 0.6em",
                    fontSize: 13,
                    fontWeight: 600,
                    marginLeft: 8,
                  }}
                >
                  {unreadConversations}
                </span>
              )}
            </button>
            <button
              className={`dashboard-menu-item ${
                isActive("/problem-board") ? "active" : ""
              }`}
              onClick={() => navigate("/problem-board")}
            >
              <MdSearch size={20} />
              Problem Board
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

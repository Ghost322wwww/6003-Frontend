import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../App.css";

type SidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isOperator = token && user?.role === "operator";

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
      window.location.reload();
    }
  };

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <button onClick={onToggle} className="toggle-btn"></button>
      <Link to="/hotels" className={`nav-link ${isActive("/hotels") ? "active" : ""}`}>
        <span className="icon">🏨</span>
        <span className="text">Hotel List</span>
      </Link>

      {isOperator && (
        <Link to="/add-hotel" className={`nav-link ${isActive("/add-hotel") ? "active" : ""}`}>
          <span className="icon">➕</span>
          <span className="text">Add Hotel</span>
        </Link>
      )}

        {token && (
        <Link to="/messages" className={`nav-link ${isActive("/messages") ? "active" : ""}`}>
            <span className="icon">💬</span>
            <span className="text">View Messages</span>
        </Link>
        )}

        {token && (
        <Link to="/favorites" className={`nav-link ${isActive("/favorites") ? "active" : ""}`}>
            <span className="icon">⭐</span>
            <span className="text">Favorites</span>
        </Link>
        )}

        {token && (
        <Link to="/Profile" className={`nav-link ${isActive("/Profile") ? "active" : ""}`}>
            <span className="icon">👤</span>
            <span className="text">Profile</span>
        </Link>
        )}

      {token ? (
        <Link to="#" onClick={e => { e.preventDefault(); handleLogout(); }} className={`nav-link`}>
          <span className="icon">🚪</span>
          <span className="text">Logout</span>
        </Link>
      ) : (
        <Link to="/login" className={`nav-link ${isActive("/login") ? "active" : ""}`}>
          <span className="icon">🔑</span>
          <span className="text">Login</span>
        </Link>
      )}

    </aside>
  );
};

export default Sidebar;
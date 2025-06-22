import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../App.css";

const SidebarLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="layout-container">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      
      <div className="content-wrapper">
        <main className="main-content">
          <Outlet />
        </main>
        <footer className="footer">© 2025 Wanderlust Travel</footer>
      </div>
    </div>
  );
};

export default SidebarLayout;

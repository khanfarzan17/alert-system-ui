import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Topbar from "../components/layout/Topbar";
import Sidebar from "../components/layout/sidebar";

const MainLayout = () => {
  const location = useLocation();
  // Hide Topbar and Sidebar on login page
  if (location.pathname === "/" || location.pathname === "/login")
    return <Outlet />;
  return (
    <div>
      <Topbar />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <main style={{ flex: 1, padding: 24 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

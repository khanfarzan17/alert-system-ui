import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Topbar from "../components/layout/Topbar";

const MainLayout = () => {
  const location = useLocation();
  // Hide Topbar on login page
  if (location.pathname === "/" || location.pathname === "/login")
    return <Outlet />;
  return (
    <div>
      <Topbar />
      <main style={{ padding: 24 }}>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;

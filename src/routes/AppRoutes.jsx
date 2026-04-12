import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "../index.css";
import { useAuth } from "../components/context/Authcontext";

import LoginPage from "../pages/Auth/LoginPage";
import UploadPage from "../pages/Upload/UploadPage";
import DashboardPage from "../pages/DashboardPage/DashboardPage";
import AlertPage from "../pages/Alerts/AlertPage";
import Settings from "../pages/settings/settings";
import NotFound from "../pages/NotFound/NotFound";
import MainLayout from "../layout/MainLayout";
import AssetPage from "../pages/Assets/AssetPage";

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/upload" replace /> : <LoginPage />
        }
      />
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/upload" replace /> : <LoginPage />
        }
      />
      <Route element={<MainLayout />}>
        <Route
          path="/upload"
          element={
            isAuthenticated ? <UploadPage /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <DashboardPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/alerts"
          element={
            isAuthenticated ? <AlertPage /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/assets"
          element={
            isAuthenticated ? <AssetPage /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/settings"
          element={
            isAuthenticated ? <Settings /> : <Navigate to="/login" replace />
          }
        />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;

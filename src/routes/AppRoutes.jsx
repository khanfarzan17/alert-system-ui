import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "../index.css";
import { useAuth } from "../components/context/Authcontext";

import LoginPage from "../pages/Auth/LoginPage";
import UploadPage from "../pages/Upload/UploadPage";
import DashboardPage from "../pages/DashboardPage/DashboardPage";
import AlertPage from "../pages/Alerts/AlertPage";
import Scheduler from "../pages/Scheduler/scheduler";
import NotFound from "../pages/NotFound/NotFound";
import MainLayout from "../layout/MainLayout";
import AssetPage from "../pages/Assets/AssetPage";
import ReportsPage from "../pages/Reports/ReportsPage";
import LoaderTestPage from "../pages/LoaderTestPage";
import UserPage from "../pages/users/user";

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
        }
      />

      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
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
          path="/scheduler"
          element={
            isAuthenticated ? <Scheduler /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/reports"
          element={
            isAuthenticated ? <ReportsPage /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/users"
          element={
            isAuthenticated ? <UserPage /> : <Navigate to="/login" replace />
          }
        />
        <Route path="/loader-test" element={<LoaderTestPage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;

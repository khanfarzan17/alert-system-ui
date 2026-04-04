import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../pages/Auth/LoginPage";
import UploadPage from "../pages/Upload/UploadPage";
import DashboardPage from "../pages/DashboardPage/DashboardPage";
import AlertPage from "../pages/Alerts/AlertPage";
import Settings from "../pages/settings/settings";
import NotFound from "../pages/NotFound/NotFound";
import MainLayout from "../layout/MainLayout";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route element={<MainLayout />}>
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/alerts" element={<AlertPage />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;

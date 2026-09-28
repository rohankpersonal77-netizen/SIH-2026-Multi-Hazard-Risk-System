import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// Layout
import { Layout } from "../components/layout/Layout";

// Public landing pages
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import HomePage from "../pages/HomePage";
import About from "../pages/About";

// Application dashboard pages
import { Dashboard } from "../pages/Dashboard";
import { RiskMapPage } from "../pages/RiskMapPage";
import { HabitationDetails } from "../pages/HabitationDetails";
import { RelocationPriorities } from "../pages/RelocationPriorities";
import { RelocationSites } from "../pages/RelocationSites";
import { CarryingCapacity } from "../pages/CarryingCapacity";
import { RelocationOptimizer } from "../pages/RelocationOptimizer";
import { LiveMonitoring } from "../pages/LiveMonitoring";
import { Analytics } from "../pages/Analytics";
import { Reports } from "../pages/Reports";

// Authentication store
import { useAuthStore } from "../store/authStore";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Root Path directly renders the main Landing Page */}
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Authenticated Web App Command Center Routes */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/map" element={<RiskMapPage />} />
        <Route path="/habitations" element={<RelocationPriorities />} />
        <Route path="/habitations/:id" element={<HabitationDetails />} />
        <Route path="/sites" element={<RelocationSites />} />
        <Route path="/capacity" element={<CarryingCapacity />} />
        <Route path="/optimizer" element={<RelocationOptimizer />} />
        <Route path="/monitoring" element={<LiveMonitoring />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/reports" element={<Reports />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
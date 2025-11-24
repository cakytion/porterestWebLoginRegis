import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import FinishSignup from "./FinishSignup";
import Dashboard from "./Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import EditPortfolio from "./EditPortfolio";

export default function App() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  return (
    <Router>
      <Routes>
        {/* หน้าแรก */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* หน้า login */}
        <Route path="/login" element={<Login />} />

        {/* หน้า register */}
        <Route path="/register" element={<Register />} />

        {/* password reset pages */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* page for new google users to select role */}
        <Route path="/finish-signup" element={<FinishSignup />} />

        {/* a protected route for the dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* เพิ่ม route สำหรับแก้ไข portfolio */}
        <Route path="/edit-portfolio" element={<EditPortfolio id={id} />} />
      </Routes>
    </Router>
  );
}



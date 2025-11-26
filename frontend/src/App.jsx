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
import AdminDashboard from "./admin/AdminDashboard";

export default function App() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  return (
    <Router>

      <Routes>
        {/* ให้เข้า /login เป็นหน้าแรก */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* หน้า login */}
        <Route path="/login" element={<Login />} />

        {/* หน้า register */}
        <Route path="/register" element={<Register />} />

        {/* password reset pages */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* page for new google users to select role */}
        {/* we might have to deal with some kind of routing for this page too in the future */}
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
        {/* ⬇⬇⬇ เพิ่ม route หน้า Admin (เริ่มแบบไม่ล็อกก่อนเพื่อเทสเร็ว) */}
        <Route path="/admin" element={<AdminDashboard />} />        
      </Routes>

    </Router>
  );
}

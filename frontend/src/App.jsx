import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import FinishSignup from "./FinishSignup";
import Dashboard from "./Dashboard";
import ProtectedRoute from "./ProtectedRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* ให้เข้า /login เป็นหน้าแรก */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* หน้า login */}
        <Route path="/login" element={<Login />} />

        {/* หน้า register */}
        <Route path="/register" element={<Register />} />

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
      </Routes>
    </Router>
  );
}

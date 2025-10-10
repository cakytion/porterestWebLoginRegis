import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./login";
import Register from "./register";

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
      </Routes>
    </Router>
  );
}

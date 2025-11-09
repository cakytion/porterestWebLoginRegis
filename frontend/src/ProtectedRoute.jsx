import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children }) {
  // get user info and isLoading status from auth context
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // show blank screen while loading
    return null;
  }

  if (!user) {
    // if not logged in, redirect to the login page
    return <Navigate to="/login" replace />;
  }

  // if logged in, render the nested component
  return children;
}

import React from "react";
import { Navigate, Outlet } from "react-router-dom";

// AuthRequired checks if the user is authenticated
const AuthRequired: React.FC = () => {
  const isAuthenticated = localStorage.getItem("login-system");

  // If user is not authenticated, redirect to login
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default AuthRequired;

import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const authToken = localStorage.getItem("authToken");

  // If the user is not authenticated, redirect to the login page
  if (!authToken) {
    return <Navigate to="/" />;
  }

  // Otherwise, render the child component (e.g., Dashboard)
  return children;
};

export default ProtectedRoute;

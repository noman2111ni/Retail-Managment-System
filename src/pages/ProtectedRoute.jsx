import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken"); // 👈 localStorage से token check करो
  return token ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;

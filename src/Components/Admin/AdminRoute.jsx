import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children, user }) => {
  if (!user || user.role !== "admin") {
    return <Navigate to="/login" />;
  }

  return children;
};

export default AdminRoute;

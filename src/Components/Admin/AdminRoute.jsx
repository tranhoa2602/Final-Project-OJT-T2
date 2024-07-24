import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children, user }) => {
  if (!user || user.role !== "Admin") {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;

import React from "react";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ user, children }) => {
  if (!user || user.role !== "Admin") {
    return <Navigate to="/" />;
  }

  return children;
};

AdminRoute.propTypes = {
  user: PropTypes.object,
  children: PropTypes.node.isRequired,
};

export default AdminRoute;

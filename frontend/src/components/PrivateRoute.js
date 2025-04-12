import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ user, children, roles }) => {
  if (!user) return <Navigate to="/" />; // Redirect to login

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" />; // Optional unauthorized page
  }

  return children;
};

export default PrivateRoute;

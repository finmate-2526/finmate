import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "@/lib/localAuth";

const AuthGuard: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const location = useLocation();
  if (!isAuthenticated()) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  return children;
};

export default AuthGuard;

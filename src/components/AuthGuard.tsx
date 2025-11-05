import React from "react";

// Frontend-only deployment: allow guest access to protected pages.
// If you later re-enable auth, restore redirect behavior here.
const AuthGuard: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  return children;
};

export default AuthGuard;

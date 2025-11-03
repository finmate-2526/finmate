import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AuthLanding: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-2xl rounded-lg border bg-card p-8 shadow">
        <h1 className="text-3xl font-bold mb-4">Welcome to Finmate (Local Auth)</h1>
        <p className="text-muted-foreground mb-6">This demo uses local-only authentication (stored in your browser's localStorage).</p>

        <div className="flex gap-4">
          <Link to="/login">
            <Button variant="default">Sign in</Button>
          </Link>
          <Link to="/register">
            <Button variant="secondary">Create account</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthLanding;

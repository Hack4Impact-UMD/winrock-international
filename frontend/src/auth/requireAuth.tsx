import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

export default function RequireAuth({ children }: { children: ReactNode }) {
    const loggedIn = sessionStorage.getItem("loggedIn");

    if (loggedIn !== "true") {
        return <Navigate to="/auth/login" replace />;
    }

    return children;
}

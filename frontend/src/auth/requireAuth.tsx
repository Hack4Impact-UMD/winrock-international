import { Navigate } from "react-router-dom";

export default function RequireAuth({ children }) {
    const loggedIn = sessionStorage.getItem("loggedIn");

    if (loggedIn !== "true") {
        return <Navigate to="/auth/login" replace />;
    }

    return children;
}
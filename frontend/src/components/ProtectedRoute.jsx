import { Navigate } from "react-router-dom";
import authService from "../lib/auth";

export default function ProtectedRoute({ children }) {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

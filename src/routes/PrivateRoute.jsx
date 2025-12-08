import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto"></div>
      <p className="mt-4 text-gray-600">Chargement...</p>
    </div>
  </div>
);

export default function PrivateRoute({ children }) {
  const { user, initializing } = useAuth();
  const location = useLocation();

  if (initializing) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si l'utilisateur est connecté, afficher le contenu
  return children;
}

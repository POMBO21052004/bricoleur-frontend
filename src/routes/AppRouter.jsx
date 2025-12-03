import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages d'authentification
import Login from "../Pages/Auth/Login";
import Register from "../Pages/Auth/Register";
import VerifyEmail from "../Pages/Auth/VerifyEmail";
import ForgotPassword from "../Pages/Auth/ForgotPassword";
import ResetPassword from "../Pages/Auth/ResetPassword";

// Pages principales
import Welcome from "../Pages/Welcome/Welcome";
import Dashboard from "../Pages/Client/Dashboard/Index";
// import Profile from "../Pages/Client/Profile/Index";
// import Technicians from "../Pages/Client/Technicians/Index";
// import TechnicianDetail from "../Pages/Client/Technicians/TechnicianDetail";

// Composants de routage
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import NotFound from "../Pages/NotFound";
import TechnicianDetail from "../Pages/Client/Techniciens/TechnicianDetail";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* === ROUTES PUBLIQUES ACCESSIBLES À TOUS === */}
        <Route path="/" element={<Welcome />} />
        
        <Route path="/login" element={ <PublicRoute> <Login /> </PublicRoute>} />
        <Route path="/register" element={ <PublicRoute> <Register /> </PublicRoute> } />
        <Route path="/reset-password/verify-email" element={ <PublicRoute> <VerifyEmail /> </PublicRoute> } /> 
        <Route path="/forgot-password" element={<PublicRoute> <ForgotPassword /> </PublicRoute> } />
        <Route path="/reset-password" element={ <PublicRoute> <ResetPassword /> </PublicRoute> } />

        {/* === ROUTES PRIVÉES (nécessitent une connexion) === */}
        <Route path="/dashboard" element={ <PrivateRoute> <Dashboard /> </PrivateRoute> } />
        <Route path="/technicians/:id" element={<PrivateRoute> <TechnicianDetail /> </PrivateRoute>} />
        {/* <Route path="/profile" element={ <PrivateRoute> <Profile /> </PrivateRoute>} />
        <Route path="/technicians" element={ <PrivateRoute> <Technicians /> </PrivateRoute> } /> */}

        {/* === PAGE 404 === */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
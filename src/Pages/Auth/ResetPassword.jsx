import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Lock } from "lucide-react";
import api from "../../services/api";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ResetPasswordPage() {
  const [form, setForm] = useState({
    password: "",
    confirm_password: "",
    uidb64: "",
    token: ""
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Récupérer uidb64 et token depuis localStorage au montage
  useEffect(() => {
    const storedUidb64 = localStorage.getItem("uidb64");
    const storedToken = localStorage.getItem("token");

    if (storedUidb64 && storedToken) {
      setForm(prev => ({
        ...prev,
        uidb64: storedUidb64,
        token: storedToken
      }));
    } else {
      toast.error("Données de vérification manquantes. Veuillez recommencer le processus.", {
        position: "top-right",
        autoClose: 4000,
      });
      setTimeout(() => {
        navigate("/forgot-password");
      }, 2000);
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (form.password !== form.confirm_password) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    if (form.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/manage_users/set-new-password/", {
        password: form.password,
        confirm_password: form.confirm_password,
        uidb64: form.uidb64,
        token: form.token
      });
      
      // Nettoyer le localStorage
      localStorage.removeItem("uidb64");
      localStorage.removeItem("token");
      localStorage.removeItem("resetEmail");
      
      toast.success("Mot de passe réinitialisé avec succès !", {
        position: "top-right",
        autoClose: 2000,
      });
      
      // Redirection vers la page de connexion
      setTimeout(() => {
        navigate("/login");
      }, 1500);
      
    } catch (error) {
      console.error("Password reset failed:", error);
      const errorMessage = error.response?.data?.message || 
                          "Erreur lors de la réinitialisation du mot de passe.";
      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-t from-green-100 to-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <Link to="/login" className="inline-flex items-center text-sm text-green-600 hover:text-green-700 mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Retour à la connexion
        </Link>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Nouveau mot de passe</h2>
          <p className="text-sm text-gray-600 mt-2">
            Choisissez un nouveau mot de passe pour votre compte
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Nouveau mot de passe
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-1">
              Confirmer le mot de passe
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="confirm_password"
                name="confirm_password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={form.confirm_password}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Réinitialisation...
              </div>
            ) : (
              "Réinitialiser le mot de passe"
            )}
          </button>
        </form>
      </div>
    </div>
    </>
  );
}
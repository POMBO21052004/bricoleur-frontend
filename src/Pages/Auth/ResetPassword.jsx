import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Lock, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import api from "../../services/api";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../../assets/images2/bricoleur.png';

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

  const navigate = useNavigate();

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (form.password !== form.confirm_password) {
      toast.error("Les mots de passe ne correspondent pas.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (form.password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/manage_users/set-new-password/", {
        password: form.password,
        confirm_password: form.confirm_password,
        uidb64: form.uidb64,
        token: form.token
      });
      
      localStorage.removeItem("uidb64");
      localStorage.removeItem("token");
      localStorage.removeItem("resetEmail");
      
      toast.success("Mot de passe réinitialisé avec succès !", {
        position: "top-right",
        autoClose: 2000,
      });
      
      setTimeout(() => {
        navigate("/login");
      }, 1500);
      
    } catch (error) {
      console.error("Password reset failed:", error);
      const errorMessage = error.response?.data?.message || 
                          "Erreur lors de la réinitialisation du mot de passe.";
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-green-50 p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6 border border-emerald-100">
          {/* Logo Header */}
          <div className="mb-6">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="w-12 h-12 rounded-lg overflow-hidden">
                <img 
                  src={logo}
                  alt="Le Bricoleur"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-center">
                <h1 className="text-xl font-bold text-gray-900">Le Bricoleur</h1>
                <p className="text-sm text-gray-600">Services professionnels</p>
              </div>
            </div>
            
            <div className="mb-4 text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Nouveau mot de passe</h2>
              <p className="text-gray-600 text-sm">
                Choisissez un nouveau mot de passe pour votre compte
              </p>
            </div>
          </div>

          {/* Formulaire */}
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit} 
            className="space-y-4"
          >
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-3 text-base border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 transition-all"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  id="confirm_password"
                  name="confirm_password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.confirm_password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-3 text-base border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 transition-all"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Réinitialisation...</span>
                </div>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <Sparkles className="w-5 h-5" />
                  <span>Réinitialiser le mot de passe</span>
                </span>
              )}
            </motion.button>
          </motion.form>

          {/* Lien retour */}
          <div className="mt-6 text-center">
            <Link 
              to="/login" 
              className="inline-flex items-center text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
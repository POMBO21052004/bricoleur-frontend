import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import api from "../../services/api";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../../assets/images2/bricoleur.png';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error("Veuillez entrer votre adresse email.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/manage_users/password-reset/", { email });
      
      localStorage.setItem("email", email);
      
      toast.success(response.data.message || "Email envoyé ! Vérifiez votre boîte de réception.", {
        position: "top-right",
        autoClose: 3000,
      });
      
      setTimeout(() => {
        navigate("/reset-password/verify-code");
      }, 1500);
      
    } catch (error) {
      console.error("Password reset request failed:", error);
      const errorMessage = error.response?.data?.message || 
                          "Erreur lors de l'envoi de l'email de réinitialisation.";
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
                <Mail className="h-8 w-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Mot de passe oublié</h2>
              <p className="text-gray-600 text-sm">
                Entrez votre email pour recevoir un code de réinitialisation
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
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full pl-10 pr-4 py-3 text-base border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 transition-all"
                  required
                />
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
                  <span>Envoi...</span>
                </div>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <Sparkles className="w-5 h-5" />
                  <span>Envoyer le code</span>
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
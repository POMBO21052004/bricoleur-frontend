import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Sparkles, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import api from "../../services/api";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../../assets/images2/bricoleur.png';

export default function VerifyEmailPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!code.trim()) {
      toast.error("Veuillez entrer le code de vérification.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/manage_users/verify-email/", { code });
      
      setSuccess(true);
      toast.success("Email vérifié avec succès !", {
        position: "top-right",
        autoClose: 2000,
      });
      
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      
    } catch (error) {
      console.error("Verification failed:", error);
      const errorMessage = error.response?.data?.message || 
                          "Code invalide ou erreur réseau.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResending(true);
    try {
      const email = localStorage.getItem("email");
      if (email) {
        await api.post("/manage_users/resend-verification-code/", { email });
        toast.success("Code renvoyé ! Vérifiez votre email.", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.error("Email non trouvé. Veuillez vous réinscrire.", {
          position: "top-right",
          autoClose: 4000,
        });
        navigate("/register");
      }
    } catch (error) {
      console.error("Resend code failed:", error);
      const errorMessage = error.response?.data?.message || 
                          "Erreur lors de l'envoi du code.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 4000,
      });
    } finally {
      setResending(false);
    }
  };

  if (success) {
    return (
      <>
        <ToastContainer />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-green-50 p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-emerald-100 text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="h-10 w-10 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Email vérifié !</h2>
            <p className="text-gray-600 mb-6">
              Votre email a été vérifié avec succès. Redirection vers la page de connexion...
            </p>
            <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </>
    );
  }

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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Vérification d'email</h2>
              <p className="text-gray-600 text-sm">
                Entrez le code de vérification envoyé à votre email
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
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                Code de vérification
              </label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                className="w-full px-3 py-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 text-center text-lg font-mono tracking-widest"
                required
              />
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
                  <span>Vérification...</span>
                </div>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <Sparkles className="w-5 h-5" />
                  <span>Vérifier le code</span>
                </span>
              )}
            </motion.button>
          </motion.form>

          {/* Bouton renvoyer */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleResendCode}
              disabled={resending}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center space-x-2"
            >
              {resending ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Envoi en cours...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  <span>Vous n'avez pas reçu le code ? Renvoyer</span>
                </>
              )}
            </button>
          </div>

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
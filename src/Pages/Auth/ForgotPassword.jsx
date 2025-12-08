import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import api from "../../services/api";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError("Veuillez entrer votre adresse email.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/manage_users/password-reset/", { email });
      
      // Stocker l'email pour la page suivante si nécessaire
      localStorage.setItem("resetEmail", email);
      
      toast.success(response.data.message || "Email envoyé ! Vérifiez votre boîte de réception.", {
        position: "top-right",
        autoClose: 3000,
      });
      
      // Redirection vers la page de vérification du code
      setTimeout(() => {
        navigate("/reset-password/verify-code");
      }, 1500);
      
    } catch (error) {
      console.error("Password reset request failed:", error);
      const errorMessage = error.response?.data?.message || 
                          "Erreur lors de l'envoi de l'email de réinitialisation.";
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
            <Mail className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Mot de passe oublié</h2>
          <p className="text-sm text-gray-600 mt-2">
            Entrez votre email pour recevoir un code de réinitialisation
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
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
                Envoi...
              </div>
            ) : (
              "Envoyer le code"
            )}
          </button>
        </form>
      </div>
    </div>
    </>
  );
}
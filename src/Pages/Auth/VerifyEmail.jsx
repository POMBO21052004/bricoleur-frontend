import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import api from "../../services/api";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function VerifyEmailPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!code.trim()) {
      setError("Veuillez entrer le code de vérification.");
      return;
    }

    setLoading(true);
    setError(null);

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
      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      const email = localStorage.getItem("email");
      if (email) {
        // Appel à l'API pour renvoyer le code de vérification
        // Note: Vous devrez peut-être ajuster l'endpoint selon votre API
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
      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 4000,
      });
    }
  };

  if (success) {
    return (
      <>
        <ToastContainer />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-t from-green-100 to-gray-50 p-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Email vérifié !</h2>
            <p className="text-gray-600 mb-4">
              Votre email a été vérifié avec succès. Redirection vers la page de connexion...
            </p>
          </div>
        </div>
      </>
    );
  }

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
          <h2 className="text-2xl font-bold text-gray-900">Vérification d'email</h2>
          <p className="text-sm text-gray-600 mt-2">
            Entrez le code de vérification envoyé à votre email
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-center text-lg font-mono tracking-widest"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Vérification...
              </div>
            ) : (
              "Vérifier le code"
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={handleResendCode}
            className="text-sm text-green-600 hover:text-green-700"
          >
            Vous n'avez pas reçu le code? Renvoyer
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
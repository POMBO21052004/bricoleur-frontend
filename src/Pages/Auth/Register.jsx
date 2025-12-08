import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Phone, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import api from "../../services/api";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../../assets/images2/bricoleur.png';

export default function RegisterPage() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    password: "",
    password_confirm: ""
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (form.password !== form.password_confirm) {
      toast.error("Les mots de passe ne correspondent pas.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/manage_users/register/", form);
      
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      if (response.data.email) {
        localStorage.setItem("email", response.data.email);
      }
      if (response.data.full_name) {
        localStorage.setItem("full_name", response.data.full_name);
      }
      
      toast.success("Inscription réussie ! Vérifiez votre email.", {
        position: "top-right",
        autoClose: 2000,
      });
      
      setTimeout(() => {
        navigate("/verify-email");
      }, 1500);
      
    } catch (error) {
      console.error("Registration failed:", error);
      
      if (error.response?.data) {
        if (typeof error.response.data === 'object') {
          setErrors(error.response.data);
          toast.error("Veuillez corriger les erreurs dans le formulaire.", {
            position: "top-right",
            autoClose: 4000,
          });
        } else {
          toast.error(error.response.data.message || "Une erreur est survenue lors de l'inscription.", {
            position: "top-right",
            autoClose: 4000,
          });
        }
      } else {
        toast.error("Erreur réseau. Veuillez réessayer.", {
          position: "top-right",
          autoClose: 4000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-green-50 p-4">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col border border-emerald-100">
          
          {/* Section Formulaire Centrée */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full p-6 lg:p-8 flex flex-col justify-center"
          >
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
              
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Créer un compte</h2>
                <p className="text-gray-600 text-sm">
                  Rejoignez notre communauté de professionnels
                </p>
              </div>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      id="first_name"
                      name="first_name"
                      type="text"
                      value={form.first_name}
                      onChange={handleChange}
                      placeholder="Votre prénom"
                      className="w-full pl-10 pr-4 py-3 text-base border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 transition-all"
                      required
                    />
                  </div>
                  {errors.first_name && (
                    <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      id="last_name"
                      name="last_name"
                      type="text"
                      value={form.last_name}
                      onChange={handleChange}
                      placeholder="Votre nom"
                      className="w-full pl-10 pr-4 py-3 text-base border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 transition-all"
                      required
                    />
                  </div>
                  {errors.last_name && (
                    <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="votre@email.com"
                    className="w-full pl-10 pr-4 py-3 text-base border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 transition-all"
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    id="phone_number"
                    name="phone_number"
                    type="tel"
                    value={form.phone_number}
                    onChange={handleChange}
                    placeholder="+237 XXX XX XX XX"
                    className="w-full pl-10 pr-4 py-3 text-base border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 transition-all"
                  />
                </div>
                {errors.phone_number && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone_number}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe
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
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <label htmlFor="password_confirm" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    id="password_confirm"
                    name="password_confirm"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.password_confirm}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-3 text-base border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center text-sm">
                <input
                  type="checkbox"
                  id="terms"
                  className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  required
                />
                <label htmlFor="terms" className="ml-2 text-gray-600">
                  J'accepte les{" "}
                  <Link to="/terms" className="text-emerald-600 hover:text-emerald-700">
                    conditions d'utilisation
                  </Link>
                </label>
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
                    <span>Inscription...</span>
                  </div>
                ) : (
                  <span className="flex items-center justify-center space-x-2">
                    <Sparkles className="w-5 h-5" />
                    <span>Créer mon compte</span>
                  </span>
                )}
              </motion.button>

              <div className="text-center pt-3">
                <p className="text-gray-600 text-sm">
                  Vous avez déjà un compte ?{' '}
                  <Link 
                    to="/login" 
                    className="font-semibold text-emerald-600 hover:text-emerald-700"
                  >
                    Se connecter
                  </Link>
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
}
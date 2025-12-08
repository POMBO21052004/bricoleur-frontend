import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../../assets/images2/bricoleur.png';
import Caroussel1 from '../../assets/images2/carousel.jpeg';
import Caroussel2 from '../../assets/images2/carousel2.jpeg';
import Caroussel3 from '../../assets/images2/carousel3.jpeg';


export default function LoginPage() {
  const [form, setForm] = useState({ 
    email: "", 
    password: "" 
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const { login } = useAuth();
  const navigate = useNavigate();

  const slides = [
    {
      image: Caroussel1,
      title: "Services de Qualité",
      subtitle: "Des artisans professionnels vérifiés"
    },
    {
      image: Caroussel2,
      title: "Intervention Rapide",
      subtitle: "Réponse en moins de 24h"
    },
    {
      image: Caroussel3,
      title: "Satisfaction Garantie",
      subtitle: "+10,000 clients satisfaits"
    }
  ];

  // Carousel auto-slide - seulement sur desktop
  useEffect(() => {
    if (window.innerWidth >= 1024) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [slides.length]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.email || !form.password) {
      toast.error("Veuillez remplir tous les champs", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/manage_users/login/", {
        email: form.email,
        password: form.password
      });

      // Stocker les informations dans le localStorage
      const { access_token, refresh_token, email, full_name } = response.data;
      
      // Stocker les informations de l'utilisateur
      localStorage.setItem("token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      localStorage.setItem("email", email);
      localStorage.setItem("full_name", full_name);
      
      await login(access_token);
      
      toast.success("Connexion réussie !", {
        position: "top-right",
        autoClose: 2000,
      });
      
      setTimeout(() => {
        navigate("/");
      }, 1500);
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "Email ou mot de passe incorrect.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-green-50 p-4">
        <div className="w-full max-w-md lg:max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row border border-emerald-100">
          
          {/* Section Carousel - Visible uniquement sur desktop */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:block w-full lg:w-1/2 relative overflow-hidden min-h-[550px]"
          >
            {/* Effet de découpe diagonal */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-emerald-50 via-white to-green-50 -translate-x-8 -translate-y-8 rotate-45 z-20"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-50 via-white to-green-50 translate-x-8 translate-y-8 rotate-45 z-20"></div>

            {/* Effet de dégradé subtil */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-600/5 z-10"></div>

            {/* Carousel */}
            <div className="relative w-full h-full z-30">
              {slides.map((slide, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: index === currentSlide ? 1 : 0,
                  }}
                  transition={{ duration: 0.6 }}
                  className={`absolute inset-0`}
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white z-40">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: index === currentSlide ? 1 : 0, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h3 className="text-2xl font-bold mb-3">{slide.title}</h3>
                      <p className="text-base opacity-90">{slide.subtitle}</p>
                    </motion.div>
                  </div>
                </motion.div>
              ))}

              {/* Navigation */}
              <motion.button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 z-50 border border-white/30"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </motion.button>
              <motion.button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 z-50 border border-white/30"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </motion.button>

              {/* Indicateurs */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-50">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentSlide
                        ? "bg-emerald-400 w-6"
                        : "bg-white/50 hover:bg-white/70"
                    }`}
                  />
                ))}
              </div>

              {/* Logo flottant */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-4 left-4 bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20 z-50"
              >
                <div className="flex items-center space-x-2">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                  >
                    <img 
                      src={logo}
                      alt="Le Bricoleur Logo"
                      className="w-full h-full object-contain"
                    />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Section Formulaire - Plein écran sur mobile, 50% sur desktop */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full lg:w-1/2 p-6 lg:p-8 flex flex-col justify-center"
          >
            {/* Logo Header - Version mobile/desktop */}
            <div className="mb-6">
              <div className="flex items-center justify-center lg:justify-start space-x-4 mb-6">
                <div className="w-12 h-12 rounded-lg overflow-hidden">
                  <img 
                    src={logo}
                    alt="Le Bricoleur"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-center lg:text-left">
                  <h1 className="text-xl font-bold text-gray-900">Le Bricoleur</h1>
                  <p className="text-sm text-gray-600">Services professionnels</p>
                </div>
              </div>
              
              <div className="mb-4 text-center lg:text-left">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Connexion</h2>
                <p className="text-gray-600 text-sm">
                  Accédez à votre compte
                </p>
              </div>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-3">
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
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <label htmlFor="remember" className="ml-2 text-gray-600">
                    Se souvenir de moi
                  </label>
                </div>
                <Link 
                  to="/forgot-password" 
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Mot de passe oublié ?
                </Link>
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
                    <span>Connexion...</span>
                  </div>
                ) : (
                  <span className="flex items-center justify-center space-x-2">
                    <Sparkles className="w-5 h-5" />
                    <span>Se connecter</span>
                  </span>
                )}
              </motion.button>

              <div className="text-center pt-3">
                <p className="text-gray-600 text-sm">
                  Nouveau sur Le Bricoleur ?{' '}
                  <Link 
                    to="/register" 
                    className="font-semibold text-emerald-600 hover:text-emerald-700"
                  >
                    Créer un compte
                  </Link>
                </p>
              </div>
            </form>

            {/* Version mobile - Logo minimal en bas */}
            <div className="mt-8 lg:hidden text-center">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-8 h-8 rounded-lg overflow-hidden">
                  <img 
                    src={logo}
                    alt="Le Bricoleur"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <p className="text-xs text-gray-500">© 2024 Le Bricoleur</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
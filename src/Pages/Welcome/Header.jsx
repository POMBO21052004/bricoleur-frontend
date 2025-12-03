import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Menu, X, Bell, MessageCircle } from 'lucide-react';
import { useAuth } from "../../contexts/AuthContext";
import logo from '../../assets/images2/bricoleur.png';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // Fonction de scroll vers une section
  const scrollToSection = (sectionId) => {
    if (window.location.pathname === '/') {
      // Si on est sur la page d'accueil, scroll vers la section
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
        setIsMenuOpen(false); // Fermer le menu mobile si ouvert
      }
    } else {
      // Si on est sur une autre page, naviguer vers l'accueil avec hash
      navigate(`/#${sectionId}`);
    }
  };

  const navItems = [
    { path: '/#home', label: 'Accueil', sectionId: 'home' },
    { path: '/#services', label: 'Services', sectionId: 'services-section' },
    { path: '/#techniciens', label: 'Techniciens', sectionId: 'technicians-section' },
    { path: '/#contact', label: 'Contact', sectionId: 'contact-section' }
  ];

  return (
    <motion.div 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-2xl border-b border-emerald-100' 
          : 'bg-white/90 backdrop-blur-md border-b border-emerald-50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex justify-between items-center py-4">
          {/* Logo amélioré */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 from-emerald-500 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-white font-bold text-lg"
                  >
                    <img 
                        src={logo}  
                        alt="Technicien professionnel à votre service" 
                        className="h-[400px] lg:h-[500px] xl:h-[600px] object-contain w-full drop-shadow-2xl "
                    />
                  </motion.div>
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-gray-800 to-emerald-700 bg-clip-text text-transparent">
                  Le Bricoleur
                </span>
                <span className="text-emerald-300 text-sm">Votre partenaire de confiance</span>
              </div>
            </Link>
          </motion.div>

          {/* Navigation Links Desktop */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <button 
                  onClick={() => scrollToSection(item.sectionId)}
                  to={item.path}
                  className={`relative font-medium text-sm transition-all duration-300 py-2 group ${
                    location.pathname === item.path
                      ? 'text-emerald-600 font-semibold'
                      : 'text-gray-700 hover:text-emerald-600'
                  }`}
                >
                  {item.label}
                  {location.pathname === item.path && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"
                    />
                  )}
                  <div className="absolute inset-x-0 -bottom-1 h-0.5 bg-emerald-500 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Auth Buttons améliorés */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Notifications et messages */}
                <div className="hidden md:flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors duration-200"
                  >
                    <Bell className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors duration-200"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Profile avec dropdown */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative group"
                >
                  <Link 
                    to="/profile" 
                    className="flex items-center space-x-3 bg-gradient-to-r from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 px-4 py-2 rounded-xl transition-all duration-300 border border-emerald-200 shadow-sm"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {user.full_name?.charAt(0) || 'U'}
                    </div>
                    <div className="hidden sm:block">
                      <div className="font-semibold text-gray-800 text-sm">{user.full_name}</div>
                      <div className="text-xs text-emerald-600">Mon profil</div>
                    </div>
                  </Link>
                  
                  {/* Dropdown menu */}
                  <div className="absolute top-full right-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl border border-emerald-100 p-2">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200 font-medium"
                      >
                        Déconnexion
                      </button>
                    </div>
                  </div>
                </motion.div>
              </>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center space-x-3"
                >
                  <Link 
                    to="/login" 
                    className="text-gray-700 hover:text-emerald-600 font-medium text-sm transition-colors duration-300 px-4 py-2 rounded-xl hover:bg-emerald-50"
                  >
                    Connexion
                  </Link>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link 
                      to="/register" 
                      className="bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      S'inscrire
                    </Link>
                  </motion.div>
                </motion.div>
              </>
            )}

            {/* Menu mobile */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors duration-200"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </nav>

        {/* Menu mobile */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-emerald-100 mt-2 overflow-hidden"
            >
              <div className="p-4 space-y-2">
                {navItems.map((item) => (
                  <motion.div
                    key={item.path}
                    whileHover={{ x: 5 }}
                  >
                    <button 
                      onClick={() => scrollToSection(item.sectionId)}
                      className={`block w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-300 ${location.pathname === item.path ? 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border border-emerald-200' : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-600'}`}
                    >
                      {item.label}
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
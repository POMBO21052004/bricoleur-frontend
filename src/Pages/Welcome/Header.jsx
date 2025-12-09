import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Menu, 
  X, 
  Bell, 
  MessageCircle, 
  LogOut, 
  Settings,
  ShoppingBag,
  ChevronDown,
  Home,
  ClipboardList,
  CreditCard,
  UserCircle,
  Package,
  HelpCircle
} from 'lucide-react';
import { useAuth } from "../../contexts/AuthContext";
import logo from '../../assets/images2/bricoleur.png';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const profileMenuRef = useRef(null);

  // Fermer le menu déroulant quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      setIsLoggingOut(false);
      setIsProfileMenuOpen(false);
    }
  };

  // Fonction de scroll vers une section
  const scrollToSection = (sectionId) => {
    if (window.location.pathname === '/') {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
        setIsMenuOpen(false);
      }
    } else {
      navigate(`/#${sectionId}`);
    }
  };

  const navItems = [
    { path: '/#home', label: 'Accueil', sectionId: 'home' },
    { path: '/#services', label: 'Services', sectionId: 'services-section' },
    { path: '/#techniciens', label: 'Techniciens', sectionId: 'technicians-section' },
    { path: '/#contact', label: 'Contact', sectionId: 'contact-section' }
  ];

  // Options du menu déroulant profil
  const profileMenuItems = [
    {
      icon: <UserCircle className="w-5 h-5" />,
      label: 'Mon Profil',
      path: '/profile',
      color: 'text-emerald-600'
    },
    {
      icon: <ClipboardList className="w-5 h-5" />,
      label: 'Mes Commandes',
      path: '/orders',
      color: 'text-blue-600'
    },
    {
      icon: <Package className="w-5 h-5" />,
      label: 'Mes Requettes',
      path: '/requettes',
      color: 'text-purple-600'
    },
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
          {/* Logo */}
          <motion.div>
            <Link to="/" className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 from-emerald-500 flex items-center justify-center">
                  <img 
                    src={logo}  
                    alt="Le Bricoleur" 
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-gray-800 to-emerald-700 bg-clip-text text-transparent hidden md:block">
                  Le Bricoleur
                </span>
                <span className="text-sm hidden md:block">
                  Votre partenaire de confiance
                </span>
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
                  className={`relative font-medium text-sm transition-all duration-300 py-2 group ${
                    location.hash === item.sectionId
                      ? 'text-emerald-600 font-semibold'
                      : 'text-gray-700 hover:text-emerald-600'
                  }`}
                >
                  {item.label}
                  {location.hash === item.sectionId && (
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

          {/* Auth Buttons */}
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

                {/* Menu déroulant profil */}
                <div className="relative" ref={profileMenuRef}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-3 bg-gradient-to-r from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 px-4 py-2 rounded-xl transition-all duration-300 border border-emerald-200 shadow-sm"
                  >
                    <div className="relative">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {user.first_name?.charAt(0) || 'U'}
                      </div>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"
                      />
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="font-semibold text-gray-800 text-sm">
                        {user.first_name} {user.last_name?.charAt(0) || ''}
                      </div>
                      <div className="text-xs text-emerald-600 flex items-center">
                        Mon compte
                        <ChevronDown className={`w-3 h-3 ml-1 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                  </motion.button>

                  {/* Menu déroulant */}
                  <AnimatePresence>
                    {isProfileMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-emerald-100 overflow-hidden z-50"
                      >
                        {/* En-tête du menu */}
                        <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-4 border-b border-emerald-100">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                              {user.first_name?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-800">{user.full_name}</div>
                              <div className="text-sm text-gray-500 truncate max-w-[180px]">{user.email}</div>
                            </div>
                          </div>
                        </div>

                        {/* Options du menu */}
                        <div className="p-2 space-y-1">
                          {profileMenuItems.map((item, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <Link
                                to={item.path}
                                onClick={() => setIsProfileMenuOpen(false)}
                                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-emerald-50 rounded-xl transition-colors duration-200 group"
                              >
                                <div className={`${item.color} transition-colors duration-200`}>
                                  {item.icon}
                                </div>
                                <span className="font-medium">{item.label}</span>
                                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                  <ChevronDown className="w-4 h-4 rotate-90 text-emerald-500" />
                                </div>
                              </Link>
                            </motion.div>
                          ))}
                        </div>

                        {/* Séparateur */}
                        <div className="border-t border-gray-100"></div>

                        {/* Bouton de déconnexion */}
                        <div className="p-2">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="flex items-center justify-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isLoggingOut ? (
                              <>
                                <div className="w-4 h-4 border-2 border-red-200 border-t-red-600 rounded-full animate-spin mr-2"></div>
                                Déconnexion...
                              </>
                            ) : (
                              <>
                                <LogOut className="w-5 h-5 mr-2" />
                                Déconnexion
                              </>
                            )}
                          </motion.button>
                        </div>

                        {/* Pied de page du menu */}
                        {/* <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
                          <div className="text-xs text-gray-500 text-center">
                            © 2024 Le Bricoleur
                          </div>
                        </div> */}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
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
                      className={`block w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-300 ${location.hash === item.sectionId ? 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border border-emerald-200' : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-600'}`}
                    >
                      {item.label}
                    </button>
                  </motion.div>
                ))}
                
                {user && (
                  <>
                    <div className="border-t border-gray-100 pt-2 mt-2">
                      {/* En-tête utilisateur mobile */}
                      <div className="px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                            {user.first_name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800">{user.full_name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </div>

                      {/* Options mobile */}
                      {profileMenuItems.slice(0, 4).map((item, index) => (
                        <Link
                          key={index}
                          to={item.path}
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-emerald-50 rounded-xl transition-colors duration-300"
                        >
                          <div className={item.color}>
                            {item.icon}
                          </div>
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      ))}

                      {/* Déconnexion mobile */}
                      <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <LogOut className="w-5 h-5" />
                        <span>
                          {isLoggingOut ? 'Déconnexion...' : 'Déconnexion'}
                        </span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
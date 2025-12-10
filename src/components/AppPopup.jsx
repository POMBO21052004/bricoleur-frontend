import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export default function AppPopup() {
  const [showAppPopup, setShowAppPopup] = useState(false);
  const [popupTimeoutId, setPopupTimeoutId] = useState(null);

  // Fonction pour fermer le popup et programmer sa réapparition
  const handleClosePopup = () => {
    setShowAppPopup(false);
    
    // Effacer le timeout précédent s'il existe
    if (popupTimeoutId) {
      clearTimeout(popupTimeoutId);
    }
    
    // Programmer la réapparition après 2 minutes (120000 ms)
    const timeoutId = setTimeout(() => {
      setShowAppPopup(true);
    }, 120000); // 2 minutes = 120000 millisecondes
    
    setPopupTimeoutId(timeoutId);
  };

  // Nettoyer le timeout lors du démontage du composant
  useEffect(() => {
    return () => {
      if (popupTimeoutId) {
        clearTimeout(popupTimeoutId);
      }
    };
  }, [popupTimeoutId]);

  // Afficher le popup après 10 secondes au chargement
  useEffect(() => {
    const initialTimeout = setTimeout(() => {
      setShowAppPopup(true);
    }, 10000); // 10 secondes

    return () => {
      clearTimeout(initialTimeout);
    };
  }, []);

  if (!showAppPopup) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-2xl p-4 border border-emerald-200 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-900 text-sm">Notre App Mobile</h3>
          <button
            onClick={handleClosePopup}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-gray-600 text-xs mb-3">Commandez en un clic, suivez en temps réel</p>
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gray-900 hover:bg-black text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300"
          >
            App Store
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300"
          >
            Play Store
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
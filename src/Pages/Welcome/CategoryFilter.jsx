// CategoryFilter.jsx - Version simplifiée et améliorée
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const categories = [
  { id: 'all', label: 'Tous les services', value: 'all', color: 'from-emerald-500 to-green-600' },
  { id: 'electrician', label: 'Électricien', value: 'electrician', color: 'from-emerald-500 to-green-600' },
  { id: 'plumber', label: 'Plombier', value: 'plumber', color: 'from-emerald-500 to-green-600' },
  { id: 'hvac', label: 'Climatisation', value: 'hvac', color: 'from-emerald-500 to-green-600' },
  { id: 'carpenter', label: 'Menuisier', value: 'carpenter', color: 'from-emerald-500 to-green-600' },
  { id: 'mechanic', label: 'Mécanicien', value: 'mechanic', color: 'from-emerald-500 to-green-600' },
  { id: 'painter', label: 'Peintre', value: 'painter', color: 'from-emerald-500 to-green-600' },
  { id: 'gardener', label: 'Jardinier', value: 'gardener', color: 'from-emerald-500 to-green-600' },
  { id: 'cleaner', label: 'Nettoyage', value: 'cleaner', color: 'from-emerald-500 to-green-600' },
  { id: 'locksmith', label: 'Serrurier', value: 'locksmith', color: 'from-emerald-500 to-green-600' },
  { id: 'roofer', label: 'Couverture', value: 'roofer', color: 'from-emerald-500 to-green-600' },
  { id: 'welder', label: 'Soudeur', value: 'welder', color: 'from-emerald-500 to-green-600' }
];

export default function CategoryFilter({ selectedCategory, setSelectedCategory }) {
  const scrollContainerRef = React.useRef(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <motion.h3 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-gray-900"
        >
          Catégories de services
        </motion.h3>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center space-x-2 text-sm text-emerald-600 font-medium"
        >
          <Sparkles className="w-4 h-4" />
          <span>Filtrez par spécialité</span>
        </motion.div>
      </div>
      
      {/* Conteneur principal amélioré */}
      <div className="bg-gradient-to-r from-emerald-50/80 to-green-50/80 rounded-3xl p-4 border border-emerald-200 shadow-lg relative backdrop-blur-sm">
        
        {/* Boutons de navigation améliorés */}
        <motion.button
        //   whileHover={{ scale: 1.1, x: -2 }}
        //   whileTap={{ scale: 0.9 }}
          onClick={scrollLeft}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 z-20 bg-white hover:bg-emerald-50 border border-emerald-300 rounded-2xl p-2 shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
          <ChevronLeft className="w-4 h-4 text-emerald-600 group-hover:text-emerald-700" />
        </motion.button>

        <motion.button
          onClick={scrollRight}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 z-20 bg-white hover:bg-emerald-50 border border-emerald-300 rounded-2xl p-2 shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
          <ChevronRight className="w-4 h-4 text-emerald-600 group-hover:text-emerald-700" />
        </motion.button>

        {/* Conteneur des catégories avec scroll */}
        <div 
          ref={scrollContainerRef}
          className="flex space-x-3 overflow-x-auto scrollbar-hide px-1 py-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedCategory(cat.value)}
              className={`flex-shrink-0 cursor-pointer transition-all duration-300 ${
                selectedCategory === cat.value
                  ? 'transform scale-105'
                  : 'hover:scale-105'
              }`}
            >
              <div className={`relative rounded-xl transition-all duration-300 min-w-32 ${
                selectedCategory === cat.value
                  ? 'bg-gradient-to-r from-emerald-500 to-green-600 shadow-lg'
                  : 'bg-white shadow-md hover:shadow-lg border border-emerald-100'
              }`}>
                {/* Bouton d'activité en haut à droite */}
                {selectedCategory === cat.value && (
                    <div className="absolute -top-1 -right-1 z-10">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`w-3 h-3 rounded-full border-2 border-white ${
                        selectedCategory === cat.value 
                            ? 'bg-green-400' 
                            : 'bg-emerald-300'
                        }`}
                    />
                    </div>
                )}

                {/* Effet de brillance pour l'élément sélectionné */}
                <AnimatePresence>
                  {selectedCategory === cat.value && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-green-500/20 rounded-xl"
                    />
                  )}
                </AnimatePresence>

                {/* Contenu de la catégorie - seulement le texte */}
                <div className={`relative px-4 py-3 text-center backdrop-blur-sm rounded-xl ${
                  selectedCategory === cat.value ? 'bg-transparent' : 'bg-white'
                }`}>
                  <h4 className={`font-semibold text-sm ${
                    selectedCategory === cat.value
                      ? 'text-white'
                      : 'text-gray-700 hover:text-emerald-600'
                  } transition-colors duration-200`}>
                    {cat.label}
                  </h4>
                
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Style pour cacher la scrollbar */}
        <style jsx="true">{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </motion.div>
  );
}
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hammer, Sparkles, Filter, Users } from 'lucide-react';
import SearchBar from './SearchBar';
import CategoryFilter from './CategoryFilter';
import TechnicianCard from './TechnicianCard';
import Pagination from './Pagination';

export default function TechniciansSection({
  technicians,
  loading,
  setCurrentPage,
  currentPage,
  totalCount,
  nextPage,
  previousPage,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  filteredTechnicians,
  professionLabels,
  formatPrice
}) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="py-20 bg-gradient-to-b from-white to-emerald-50/30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header avec animations */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-8"
        >
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-100 rounded-xl">
                  <Users className="w-6 h-6 text-emerald-600" />
                </div>
                <motion.h2 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="text-4xl lg:text-5xl font-bold text-gray-900"
                >
                  Nos Experts{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-700">
                    Qualifiés
                  </span>
                </motion.h2>
              </div>
              
              {/* Barre de recherche sur la même ligne (desktop) */}
              <div className="hidden lg:block w-96">
                <SearchBar 
                  searchQuery={searchQuery} 
                  setSearchQuery={setSearchQuery} 
                />
              </div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full mb-6"
            ></motion.div>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-xl text-gray-600 max-w-2xl leading-relaxed"
            >
              Découvrez notre réseau de <span className="font-semibold text-emerald-600">techniciens certifiés</span> prêts à vous accompagner dans tous vos projets de réparation et rénovation.
            </motion.p>

            {/* Barre de recherche mobile */}
            <div className="lg:hidden mt-6">
              <SearchBar 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
              />
            </div>

            {/* Stats en ligne */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-6 mt-6"
            >
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">{totalCount}+ Techniciens actifs</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">98% de satisfaction</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Filtres avec animations */}
        <motion.div
          id="technicians-section"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mb-12"
        >
          <CategoryFilter 
            selectedCategory={selectedCategory} 
            setSelectedCategory={setSelectedCategory} 
          />
        </motion.div>

        {/* Technicians Grid avec animations stagger */}
        {loading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center py-20"
          >
            <div className="text-center space-y-4">
              <div className="w-20 h-20 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-600 font-medium">Chargement des techniciens...</p>
            </div>
          </motion.div>
        ) : (
          <>
            <AnimatePresence>
              {filteredTechnicians.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredTechnicians.map((tech, index) => (
                    <motion.div
                      key={tech.id}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 }
                      }}
                      transition={{ delay: index * 0.1 }}
                      className="h-full"
                    >
                      <TechnicianCard 
                        tech={tech}
                        professionLabels={professionLabels}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20 bg-white rounded-3xl border border-emerald-200"
                >
                  <motion.div
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Hammer className="w-20 h-20 text-emerald-400 mx-auto mb-6" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Aucun technicien trouvé</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Essayez de modifier vos critères de recherche ou élargissez votre zone de recherche.
                  </p>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    className="bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300"
                  >
                    Voir tous les techniciens
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pagination */}
            {filteredTechnicians.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-16"
              >
                <Pagination
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  totalCount={totalCount}
                  previousPage={previousPage}
                  nextPage={nextPage}
                />
              </motion.div>
            )}
          </>
        )}
      </div>
    </motion.section>
  );
}
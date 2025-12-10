import React from 'react';
import { motion } from 'framer-motion';
import { Search, Star, Users, Award, Clock } from 'lucide-react';
import heroMain from '../../assets/images2/ingenieur2_removebg.png';

export default function Hero({ 
  totalCount, 
  user, 
  searchQuery, 
  setSearchQuery,
  satisfactionRate,  
  certifiedPercentage, 
  projectsCompleted 
}) {
  // Statistiques dynamiques
  const stats = [
    { 
      icon: Users, 
      value: `${totalCount || 0}`, 
      label: 'Techniciens',
      tooltip: 'Total des techniciens actifs'
    },
    { 
      icon: Star, 
      value: `${satisfactionRate || '?'}/5`, 
      label: 'Satisfaction',
      tooltip: 'Note moyenne basée sur les avis clients'
    },
    { 
      icon: Award, 
      value: `${certifiedPercentage || '?'} %`, 
      label: 'Certifiés',
      tooltip: 'Pourcentage de techniciens avec grade'
    },
    { 
      icon: Clock, 
      value: '1h', 
      label: 'Rapidité',
      tooltip: 'Temps moyen de réponse'
    }
  ];

  const scrollToTechnicians = () => {
    const techniciansSection = document.getElementById('technicians-section');
    if (techniciansSection) {
      techniciansSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  // Formater le nombre de projets
  const formatProjects = (count) => {
    if (!count) return '500+';
    if (count >= 1000) return `${(count/1000).toFixed(1)}k+`;
    return `${count}+`;
  };

  return (
    <motion.div 
      id="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-20 w-full relative overflow-hidden min-h-screen flex items-end lg:items-center"
      style={{
        backgroundColor: '#B6E9D4', 
      }}
    >
      {/* Overlay gradient amélioré */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-emerald-50/70 to-green-100/80"></div>
      
      {/* Background Elements animés */}
      <div className="absolute inset-0 opacity-20">
        <motion.div 
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-72 h-72 bg-emerald-400 rounded-full blur-3xl"
        ></motion.div>
        <motion.div 
          animate={{ 
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-green-500 rounded-full blur-3xl"
        ></motion.div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-end lg:items-center">
          
          {/* Text Section améliorée */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight"
              >
                Trouvez le bon
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-700"
                >
                  professionnel
                </motion.span>
              </motion.h1>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="space-y-4"
              >
                <p className="text-2xl md:text-3xl text-gray-900 leading-relaxed max-w-2xl font-normal">
                  Découvrez notre réseau de
                  <span className="font-bold text-emerald-700"> techniciens qualifiés</span> 
                  <span> disponibles près de chez vous pour tous vos projets de </span>
                  <span className="font-bold text-green-700"> réparation et rénovation</span>.
                </p>
              </motion.div>

            </div>

            {/* Barre de recherche améliorée */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="flex flex-col space-y-4"
            >
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-emerald-600 transition-colors" />
                <input
                  type="text"
                  placeholder="Rechercher un technicien, un service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/90 backdrop-blur-sm border-2 border-green-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 text-base transition-all duration-300 shadow-lg hover:shadow-xl focus:shadow-2xl"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={scrollToTechnicians}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-300 shadow-lg"
                >
                  Rechercher
                </motion.button>
              </div>
            </motion.div>

            {/* Statistiques avec tooltips */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                  className="text-center p-3 bg-white/80 backdrop-blur-sm rounded-xl border border-green-100 shadow-sm relative group"
                  title={stat.tooltip}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-green-50 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <stat.icon className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                    <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                    <div className="text-xs text-gray-600">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

          </motion.div>

          {/* Image Section */}
          <motion.div 
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative h-full flex items-end justify-center lg:justify-end"
          >
            <div className="relative z-10">
              {/* Image principale avec effet de flotteur */}
              <motion.div
                animate={{ 
                  y: [0, -15, 0],
                }}
                transition={{ 
                  duration: 6, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="relative overflow-visible"
              >
                <img 
                  src={heroMain}  
                  alt="Technicien professionnel à votre service" 
                  className="h-[500px] lg:h-[600px] xl:h-[700px] object-contain w-full drop-shadow-2xl "
                />

                {/* Badge de projets réalisés - dynamique */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.8, duration: 0.6 }}
                  className="absolute bottom-20 -left-8 bg-gradient-to-r from-emerald-600 to-green-700 text-white rounded-2xl p-4 shadow-2xl"
                >
                  <div className="text-center">
                    <div className="text-lg font-bold">{formatProjects(projectsCompleted)}</div>
                    <div className="text-xs">Projets réalisés</div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
            
            {/* Effet de lumière */}
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-emerald-400 rounded-full blur-3xl opacity-30"></div>
          </motion.div>
        </div>
      </div>

      {/* Vague décorative en bas */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent"></div>
    </motion.div>
  );
}
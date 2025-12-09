import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Phone, Star, Clock, Award, MessageCircle } from 'lucide-react';
import placeholder from '../../assets/images2/placeholder2.jpeg';

export default function TechnicianCard({ tech, professionLabels }) {

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rate, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getGradeColor = (grade) => {
      const colors = {
      'G3': 'bg-gradient-to-br from-amber-800 via-amber-700 to-amber-900', // Cuivre profond
      'G2': 'bg-gradient-to-br from-gray-700 via-gray-100 to-gray-500', // Argent brillant
      'G1': 'bg-gradient-to-br from-yellow-300 via-yellow-200 to-yellow-400', // Or éclatant
    };
    return colors[grade] || 'bg-gradient-to-br from-gray-500 to-gray-700';
  };

  const avgRating = calculateAverageRating(tech.reviews_received);
  const isVerified = tech.is_verified;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="bg-white rounded-2xl border border-emerald-100 hover:border-emerald-300 transition-all duration-300 overflow-hidden group h-full flex flex-col" 
    >
      {/* En-tête avec image et badges */}
      <div className="relative h-40 overflow-hidden">
        <img 
          src={tech.banner || placeholder} 
          alt={`${tech.user.first_name} ${tech.user.last_name}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        
        {/* Badges */}
        <div className="absolute top-3 right-3 flex items-center space-x-2">
          {/* Badge Grade - Octagone */}
          {tech.grade && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className={`octagon-badge w-8 h-8 ${getGradeColor(tech.grade)} shadow-lg`}
              title={`Grade ${tech.grade}`}
            >
              <span className="text-xs font-bold text-white">{tech.grade}</span>
            </motion.div>
          )}

          {isVerified && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center space-x-1 bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-md"
            >
              <Award className="w-3 h-3" />
              <span>Vérifié</span>
            </motion.div>
          )}
        </div>

        {/* Effet de brillance au hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
      </div>
      
      {/* Contenu de la carte */}
      <div className="p-4 flex-1 flex flex-col">
        {/* En-tête avec avatar et nom */}
        <div className="flex items-center space-x-3 mb-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            <img 
              src={tech.banner || placeholder}
              alt={tech.user.first_name}
              className="w-10 h-10 rounded-xl border-2 border-white shadow-md"
              onError={(e) => {
                e.target.src = { placeholder };
              }}
            />
            
          </motion.div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-sm truncate">
              {tech.user.first_name} {tech.user.last_name}
            </h3>
            <motion.p 
              whileHover={{ color: '#059669' }}
              className="text-emerald-600 font-semibold text-xs truncate"
            >
              {professionLabels[tech.profession] || tech.profession}
            </motion.p>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-xs mb-3 line-clamp-2 leading-relaxed">
          {tech.description.substring(0, 80)}...
        </p>

        {/* Informations de localisation */}
        <div className="flex items-center text-xs text-gray-500 mb-3">
          <div className="flex items-center space-x-1">
            <MapPin className="w-3 h-3 text-emerald-500" />
            <span>{tech.user.city || 'Douala'}</span>
          </div>
        </div>

        {/* Note et avis */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 bg-emerald-50 rounded-lg px-2 py-1">
            <span className="text-xs font-bold text-gray-900">{avgRating}</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-2.5 h-2.5 ${
                    i < Math.floor(avgRating) 
                      ? 'text-yellow-400 fill-yellow-400' 
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">({tech.reviews_received.length})</span>
          </div>
        </div>

        {/* Bouton Contacter */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-auto"
        >
          <Link
            to={`/technicians/${tech.id}`}
            className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white text-center py-2.5 rounded-xl font-semibold text-xs transition-all duration-300 flex items-center justify-center space-x-2" // SUPPRIMEZ shadow-md hover:shadow-lg
          >
            <MessageCircle className="w-3 h-3" />
            <span>Contacter</span>
          </Link>
        </motion.div>
      </div>

      <style jsx="true">{`
        /* Hexagone à 8 côtés */
        .octagon-badge {
          clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          font-weight: bold;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        /* Variante avec effet 3D */
        .octagon-badge-3d {
          position: relative;
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .octagon-badge-3d::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%);
          z-index: 1;
        }

        .octagon-badge-3d .octagon-text {
          position: relative;
          z-index: 2;
          font-weight: bold;
          color: white;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }
      `}</style>

    </motion.div>
  );
}

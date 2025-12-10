import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import Header from './Header';
import Hero from './Hero';
import TechniciansSection from './TechniciansSection';
import ContactForm from './ContactForm';
import Footer from './Footer';
import AppPopup from '../../components/AppPopup';

export default function Welcome() {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { user } = useAuth();
  const navigate = useNavigate();
   const [stats, setStats] = useState({
    satisfactionRate: 0,
    certifiedPercentage: 0,
    projectsCompleted: 0
  });

  const professionLabels = {
    electrician: 'Électricien',
    plumber: 'Plombier',
    hvac: 'Climatisation',
    carpenter: 'Menuisier',
    mechanic: 'Mécanicien',
    painter: 'Peintre',
    gardener: 'Jardinier',
    cleaner: 'Nettoyage',
    locksmith: 'Serrurier',
    roofer: 'Couverture',
    welder: 'Soudeur',
    mason: 'Maçon',
    landscaper: 'Paysagiste',
    plasterer: 'Plâtrier',
    tiler: 'Carreleur',
    fencer: 'Clôture',
    pest_control: 'Dératisation',
    security: 'Sécurité',
    moving: 'Déménagement',
    other: 'Autre'
  };

  useEffect(() => {
    fetchTechnicians();
  }, [currentPage]);

  const fetchTechnicians = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/manage_users/technicien/?page=${currentPage}`);
      const data = response.data;
      
      setTechnicians(data.results || []);
      setTotalCount(data.count || 0);
      setNextPage(data.next);
      setPreviousPage(data.previous);
      
      // Appeler calculateStatistics après avoir reçu les données
      calculateStatistics(data.results || []);
    } catch (error) {
      console.error('Error fetching technicians:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour calculer les statistiques
  const calculateStatistics = (techs) => {
    if (!techs || techs.length === 0) {
      // Si pas de techniciens, mettre des valeurs par défaut
      setStats({
        satisfactionRate: 0,
        certifiedPercentage: 0,
        projectsCompleted: 0
      });
      return;
    }

    let totalReviews = 0;
    let totalRating = 0;
    let certifiedCount = 0;

    techs.forEach(tech => {
      // Compter les techniciens avec grade (certifiés)
      if (tech.grade && tech.grade.trim() !== '') {
        certifiedCount++;
      }

      // Calculer la satisfaction (notes)
      if (tech.reviews_received && tech.reviews_received.length > 0) {
        tech.reviews_received.forEach(review => {
          totalRating += review.rate || 0;
          totalReviews++;
        });
      }
    });

    // Calculer le taux de satisfaction
    const satisfactionRate = totalReviews > 0 
      ? (totalRating / totalReviews).toFixed(1)
      : 0; // Valeur par défaut si pas d'avis

    // Calculer le pourcentage de certifiés
    const certifiedPercentage = techs.length > 0
      ? Math.round((certifiedCount / techs.length) * 100)
      : 0; // Valeur par défaut

    // Projets réalisés totaux (estimation basée sur le nombre de techniciens)
    const projectsCompleted = techs.length > 0 
      ? techs.length * 10 // Estimation - à ajuster selon vos données réelles
      : 0; // Valeur par défaut

    console.log('Statistiques calculées:', {
      satisfactionRate,
      certifiedPercentage,
      projectsCompleted,
      totalReviews,
      certifiedCount,
      totalTechs: techs.length
    });

    setStats({
      satisfactionRate: satisfactionRate === 'NaN' ? 0 : satisfactionRate,
      certifiedPercentage,
      projectsCompleted
    });
  };

  const filteredTechnicians = technicians.filter(tech => {
    const matchesSearch = tech.user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tech.user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tech.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         professionLabels[tech.profession]?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tech.profession === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: 'XAF'
    }).format(price);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white overflow-hidden"
    >
      <Header />
      
      <Hero 
        totalCount={totalCount} 
        user={user} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        satisfactionRate={stats.satisfactionRate}
        certifiedPercentage={stats.certifiedPercentage}
        projectsCompleted={stats.projectsCompleted}
      />
      
      <TechniciansSection
        technicians={technicians}
        loading={loading}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalCount={totalCount}
        nextPage={nextPage}
        previousPage={previousPage}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        filteredTechnicians={filteredTechnicians}
        professionLabels={professionLabels}
        formatPrice={formatPrice}
      />

      <ContactForm />

      <AppPopup />
      
      <Footer />
    </motion.div>
  );
}
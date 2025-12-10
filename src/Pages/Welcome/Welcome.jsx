// Welcome.jsx - Fichier principal mis à jour
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
    } catch (error) {
      console.error('Error fetching technicians:', error);
    } finally {
      setLoading(false);
    }
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
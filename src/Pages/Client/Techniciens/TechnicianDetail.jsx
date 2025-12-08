// TechnicianDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Phone, MessageCircle, Star, MapPin, Clock, Award, 
  Shield, User, Mail, ChevronLeft, ChevronRight, 
  CheckCircle, X, ThumbsUp, MessageSquare, Send, Loader,
  Home, Check, ShieldCheck, Target, Calendar, Users,
  Briefcase, AlertCircle, Heart, Sparkles, Download
} from 'lucide-react';
import { useAuth } from "../../../contexts/AuthContext";
import api from "../../../services/api";
import placeholder from '../../../assets/images2/placeholder2.jpeg';
import Header from '../../Welcome/Header';

export default function TechnicianDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [technician, setTechnician] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    comment: '',
    rate: 5
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const [hasReviewed, setHasReviewed] = useState(false);
  
  // État pour les notifications toast
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

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
    fetchTechnicianDetails();
  }, [id]);

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà laissé un avis
    if (user && reviews.length > 0) {
      const userReview = reviews.find(review => review.user === user.email);
      setHasReviewed(!!userReview);
    }
  }, [user, reviews]);

  const fetchTechnicianDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/manage_users/technicien/${id}/`);
      setTechnician(response.data);
      setReviews(response.data.reviews_received || []);
    } catch (err) {
      setError('Erreur lors du chargement du technicien');
      showNotification('Erreur lors du chargement du technicien', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    
    // Masquer automatiquement après 5 secondes
    setTimeout(() => {
      setShowToast(false);
    }, 5000);
  };

  const handleContact = async (type) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      // Enregistrer l'historique de contact
      await api.post('/manage_users/contact-technician/', {
        technician_id: id
      });

      // Gérer le type de contact
      if (type === 'whatsapp') {
        const phone = technician.user.phone_number.replace(/\D/g, '');
        const message = `Bonjour ${technician.user.first_name}, je suis intéressé par vos services de ${professionLabels[technician.profession] || technician.profession}.`;
        window.open(`https://wa.me/+237${phone}?text=${encodeURIComponent(message)}`, '_blank');
        showNotification('Ouverture de WhatsApp en cours...');
      } else if (type === 'call') {
        window.open(`tel:+237${technician.user.phone_number}`);
        showNotification('Appel en cours...');
      } else if (type === 'email') {
        window.open(`mailto:${technician.user.email}?subject=Demande de service - ${professionLabels[technician.profession]}`);
        showNotification('Ouverture de votre client email...');
      }
    } catch (err) {
      console.error('Erreur de contact:', err);
      showNotification('Erreur lors du contact avec le technicien', 'error');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }

    if (hasReviewed) {
      showNotification('Vous avez déjà laissé un avis pour ce technicien', 'error');
      return;
    }

    try {
      setSubmittingReview(true);
      await api.post('/manage_users/review/', {
        technician: id,
        comment: reviewForm.comment,
        rate: reviewForm.rate
      });
      
      // Recharger les avis
      await fetchTechnicianDetails();
      setReviewForm({ comment: '', rate: 5 });
      setShowReviewModal(false);
      setHasReviewed(true);
      
      showNotification('Votre avis a été publié avec succès!');
    } catch (err) {
      console.error('Erreur:', err);
      if (err.response?.status === 400 && err.response?.data?.detail?.includes('déjà')) {
        showNotification('Vous avez déjà laissé un avis pour ce technicien', 'error');
        setHasReviewed(true);
      } else {
        showNotification('Erreur lors de la publication de l\'avis', 'error');
      }
    } finally {
      setSubmittingReview(false);
    }
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rate, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const avgRating = calculateAverageRating(reviews);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-green-50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 font-medium">Chargement du technicien...</p>
        </div>
      </div>
    );
  }

  if (error || !technician) {
    return (
      <>
        <Header />
        <div className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-green-50">
          <div className="text-center space-y-6">
            <X className="w-20 h-20 text-red-500 mx-auto" />
            <h3 className="text-2xl font-bold text-gray-900">Technicien non trouvé</h3>
            <p className="text-gray-600">Le technicien que vous recherchez n'existe pas ou a été supprimé.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </>
    );
  }

  const allImages = [technician.banner, ...(technician.images?.map(img => img.image) || [])].filter(Boolean);

  return (
    <>
      <Header />
      
      {/* Modal d'avis */}
      <AnimatePresence>
        {showReviewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowReviewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-emerald-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Laisser un avis</h3>
                    <p className="text-sm text-gray-500 mt-1">Votre avis nous aide à améliorer nos services</p>
                  </div>
                  <button
                    onClick={() => setShowReviewModal(false)}
                    className="text-gray-400 hover:text-gray-600 hover:bg-emerald-50 p-1 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {hasReviewed ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Merci pour votre avis!</h4>
                    <p className="text-gray-600">Vous avez déjà partagé votre expérience avec ce technicien.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitReview} className="space-y-6">
                    {/* Note */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Votre note
                      </label>
                      <div className="flex justify-center space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewForm({...reviewForm, rate: star})}
                            className="focus:outline-none transition-transform hover:scale-110"
                          >
                            <Star 
                              className={`w-10 h-10 ${star <= reviewForm.rate ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                            />
                          </button>
                        ))}
                      </div>
                      <div className="text-center mt-2 text-sm text-gray-500">
                        {reviewForm.rate === 5 && 'Excellent'}
                        {reviewForm.rate === 4 && 'Très bien'}
                        {reviewForm.rate === 3 && 'Bien'}
                        {reviewForm.rate === 2 && 'Moyen'}
                        {reviewForm.rate === 1 && 'Médiocre'}
                      </div>
                    </div>

                    {/* Commentaire */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Votre commentaire
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <textarea
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border-2 border-emerald-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 transition-all duration-300"
                        rows="4"
                        placeholder="Décrivez votre expérience avec ce technicien..."
                        required
                      />
                      <p className="text-xs text-gray-500 mt-2">Votre avis sera publié et visible par tous les utilisateurs.</p>
                    </div>

                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={() => setShowReviewModal(false)}
                        className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        disabled={submittingReview}
                        className="flex-1 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                      >
                        {submittingReview ? (
                          <>
                            <Loader className="w-5 h-5 animate-spin" />
                            <span>Publication...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            <span>Publier l'avis</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: 0 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <div className={`rounded-xl shadow-lg border-2 ${
              toastType === 'success' 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            } p-4 max-w-sm`}>
              <div className="flex items-start">
                <div className={`flex-shrink-0 ${
                  toastType === 'success' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {toastType === 'success' ? (
                    <CheckCircle className="w-5 h-5 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 mt-0.5" />
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <p className={`text-sm font-medium ${
                    toastType === 'success' 
                      ? 'text-green-800' 
                      : 'text-red-800'
                  }`}>
                    {toastMessage}
                  </p>
                </div>
                <button
                  onClick={() => setShowToast(false)}
                  className="ml-4 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-20 min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
        {/* Header du technicien */}
        <div className="relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-green-500/10 to-emerald-500/10"></div>
          
          {/* Éléments décoratifs */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-300 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-400 rounded-full blur-3xl"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              {/* Informations du technicien */}
              <div className="flex-1">
                <button
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 font-medium mb-8 group"
                >
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  <span>Retour</span>
                </button>

                <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-2xl">
                      <img
                        src={technician.banner || placeholder}
                        alt={technician.user.first_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {technician.is_verified && (
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white p-2 rounded-full shadow-lg">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  {/* Nom et informations */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                        {technician.user.first_name} {technician.user.last_name}
                      </h1>
                      <span className="inline-flex items-center px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-semibold rounded-full shadow-md">
                        {professionLabels[technician.profession] || technician.profession}
                      </span>
                    </div>

                    {/* Localisation et note */}
                    <div className="flex flex-wrap items-center gap-4 text-gray-700">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-5 h-5 text-emerald-600" />
                        <span>{technician.user.city || 'Douala'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        <span className="font-semibold">{avgRating}</span>
                        <span className="text-gray-500">({reviews.length} avis)</span>
                      </div>
                    </div>

                    {/* Disponibilité */}
                    <div className="flex items-center space-x-2 mt-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-gray-600">Disponible maintenant</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleContact('whatsapp')}
                  className="bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-3 shadow-xl hover:shadow-2xl"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>WhatsApp</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleContact('call')}
                  className="bg-gradient-to-r from-emerald-100 to-green-50 hover:from-emerald-200 hover:to-green-100 text-emerald-700 px-6 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-3 border-2 border-emerald-200 hover:border-emerald-300"
                >
                  <Phone className="w-5 h-5" />
                  <span>Appeler</span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contenu principal */}
            <div className="lg:col-span-2 space-y-8">
              {/* Onglets */}
              <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden">
                <div className="flex border-b border-emerald-100">
                  {[
                    { id: 'about', label: 'À propos', icon: User },
                    { id: 'reviews', label: `Avis (${reviews.length})`, icon: MessageSquare },
                    { id: 'gallery', label: `Galerie (${allImages.length})`, icon: Briefcase }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 px-6 py-4 text-sm font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                        activeTab === tab.id
                          ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50'
                          : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50/30'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>

                {/* Contenu des onglets */}
                <div className="p-6">
                  {/* À propos */}
                  <AnimatePresence mode="wait">
                    {activeTab === 'about' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                      >
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 mb-4">Présentation</h2>
                          <div className="prose max-w-none">
                            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                              {technician.description}
                            </p>
                          </div>
                        </div>

                        {/* Services proposés */}
                        {/* <div className="mt-8">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                            <Briefcase className="w-5 h-5 text-emerald-600" />
                            <span>Services proposés</span>
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {[
                              'Installation professionnelle',
                              'Dépannage urgent 24h/24',
                              'Maintenance préventive',
                              'Conseils techniques gratuits',
                              'Service après-vente',
                              'Devis personnalisé gratuit'
                            ].map((service, index) => (
                              <div key={index} className="flex items-center space-x-3 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                                <Check className="w-4 h-4 text-green-500" />
                                <span className="text-gray-700">{service}</span>
                              </div>
                            ))}
                          </div>
                        </div> */}

                        {/* Zone d'intervention */}
                        <div className="mt-8 p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-200">
                          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                            <MapPin className="w-5 h-5 text-emerald-600" />
                            <span>Zone d'intervention</span>
                          </h3>
                          <div className="flex items-center space-x-2 text-gray-700">
                            <span className="font-medium">{technician.user.city || 'Douala'}</span>
                            <span className="text-gray-500">et ses environs</span>
                          </div>
                          {technician.user.address && (
                            <p className="text-gray-600 mt-2">{technician.user.address}</p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Avis */}
                  <AnimatePresence mode="wait">
                    {activeTab === 'reviews' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center space-x-4">
                            <div className="text-center bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl px-6 py-4 border border-emerald-200">
                              <div className="text-3xl font-bold text-emerald-600">{avgRating}</div>
                              <div className="flex justify-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`w-4 h-4 ${i < Math.floor(avgRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                  />
                                ))}
                              </div>
                              <div className="text-sm text-gray-600 mt-1">{reviews.length} avis</div>
                            </div>
                          </div>
                          
                          {!hasReviewed && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setShowReviewModal(true)}
                              className="bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                            >
                              <MessageSquare className="w-5 h-5" />
                              <span>Donner votre avis</span>
                            </motion.button>
                          )}
                        </div>

                        {/* Liste des avis */}
                        <div className="space-y-6">
                          {reviews.length > 0 ? (
                            reviews.map((review) => (
                              <div key={review.id} className="border border-emerald-100 rounded-2xl p-6 hover:shadow-md transition-shadow bg-white">
                                <div className="flex items-start justify-between mb-4">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center">
                                      <User className="w-6 h-6 text-emerald-600" />
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-gray-900">{review.user}</h4>
                                      <div className="flex items-center space-x-2 mt-1">
                                        <div className="flex">
                                          {[...Array(5)].map((_, i) => (
                                            <Star 
                                              key={i} 
                                              className={`w-4 h-4 ${i < review.rate ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                            />
                                          ))}
                                        </div>
                                        <span className="text-sm text-gray-500">
                                          {new Date(review.created_at).toLocaleDateString('fr-FR', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                          })}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <p className="text-gray-600">{review.comment}</p>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-12 border-2 border-dashed border-emerald-100 rounded-2xl bg-emerald-50/30">
                              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun avis pour l'instant</h3>
                              <p className="text-gray-600 mb-6">Soyez le premier à partager votre expérience!</p>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowReviewModal(true)}
                                className="bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                              >
                                Donner votre avis
                              </motion.button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Galerie */}
                  <AnimatePresence mode="wait">
                    {activeTab === 'gallery' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        {allImages.length > 0 ? (
                          <>
                            {/* Image principale */}
                            <div className="mb-6">
                              <div className="relative h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100">
                                <img
                                  src={allImages[activeImageIndex]}
                                  alt={`Travail ${activeImageIndex + 1}`}
                                  className="w-full h-full object-cover"
                                />
                                {/* Navigation */}
                                {allImages.length > 1 && (
                                  <>
                                    <button
                                      onClick={() => setActiveImageIndex(prev => (prev - 1 + allImages.length) % allImages.length)}
                                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-colors"
                                    >
                                      <ChevronLeft className="w-6 h-6 text-emerald-600" />
                                    </button>
                                    <button
                                      onClick={() => setActiveImageIndex(prev => (prev + 1) % allImages.length)}
                                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-colors"
                                    >
                                      <ChevronRight className="w-6 h-6 text-emerald-600" />
                                    </button>
                                  </>
                                )}
                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white text-sm px-4 py-2 rounded-full">
                                  {activeImageIndex + 1} / {allImages.length}
                                </div>
                              </div>
                            </div>

                            {/* Miniatures */}
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                              {allImages.map((img, index) => (
                                <button
                                  key={index}
                                  onClick={() => setActiveImageIndex(index)}
                                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                                    index === activeImageIndex 
                                      ? 'border-emerald-500 ring-2 ring-emerald-200' 
                                      : 'border-transparent hover:border-emerald-300'
                                  }`}
                                >
                                  <img
                                    src={img}
                                    alt={`Miniature ${index + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </button>
                              ))}
                            </div>
                          </>
                        ) : (
                          <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Home className="w-8 h-8 text-emerald-600" />
                            </div>
                            <p className="text-gray-600">Aucune photo disponible pour le moment</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Contact card */}
              <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center space-x-2">
                  <Phone className="w-5 h-5 text-emerald-600" />
                  <span>Contact rapide</span>
                </h3>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
                    <div className="text-sm text-gray-500 mb-1">Téléphone</div>
                    <div className="font-semibold text-gray-900 text-lg">{technician.user.phone_number}</div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
                    <div className="text-sm text-gray-500 mb-1">Email</div>
                    <div className="font-semibold text-gray-900 truncate">{technician.user.email}</div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
                    <div className="text-sm text-gray-500 mb-1">Localisation</div>
                    <div className="font-semibold text-gray-900">
                      {technician.user.city || 'Douala'}
                      {technician.user.address && (
                        <div className="text-sm text-gray-600 mt-1">{technician.user.address}</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleContact('email')}
                    className="w-full bg-gradient-to-r from-emerald-100 to-green-100 hover:from-emerald-200 hover:to-green-200 text-emerald-700 py-3 rounded-xl font-semibold transition-all duration-300 border-2 border-emerald-200"
                  >
                    Envoyer un email
                  </motion.button>
                </div>
              </div>

              {/* Badges de confiance */}
              {/* <div className="bg-gradient-to-r from-emerald-600 to-green-700 rounded-2xl shadow-xl p-6 text-white">
                <h3 className="text-lg font-bold mb-6 flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5" />
                  <span>Nos garanties</span>
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold">Technicien vérifié</div>
                      <div className="text-sm text-white/80">Compétences validées</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold">Satisfaction garantie</div>
                      <div className="text-sm text-white/80">Travail de qualité</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold">Réponse rapide</div>
                      <div className="text-sm text-white/80">Moins de 24h</div>
                    </div>
                  </div>
                </div>
              </div> */}

              {/* Statistiques */}
              {/* <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center space-x-2">
                  <Users className="w-5 h-5 text-emerald-600" />
                  <span>Statistiques</span>
                </h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
                    <div className="text-2xl font-bold text-emerald-600">{reviews.length}</div>
                    <div className="text-sm text-gray-600 mt-1">Avis</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
                    <div className="text-2xl font-bold text-emerald-600">{avgRating}/5</div>
                    <div className="text-sm text-gray-600 mt-1">Note</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
                    <div className="text-2xl font-bold text-emerald-600">
                      {technician.is_verified ? 'Vérifié' : 'En attente'}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Statut</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
                    <div className="text-2xl font-bold text-emerald-600">
                      {technician.user.city ? 'Local' : 'National'}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Zone</div>
                  </div>
                </div>
              </div> */}

              {/* Bouton de téléchargement de l'app */}
              {/* <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-2xl p-6 border border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-500">
                <div className="flex items-center space-x-4">
                  <motion.div 
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="bg-emerald-500 p-4 rounded-2xl shadow-lg"
                  >
                    <Download className="w-8 h-8 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">Notre App Mobile</h3>
                    <p className="text-gray-600 text-sm mb-3">Commandez en un clic</p>
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-medium transition-all duration-300 shadow-md"
                      >
                        App Store
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-medium transition-all duration-300 shadow-md"
                      >
                        Play Store
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
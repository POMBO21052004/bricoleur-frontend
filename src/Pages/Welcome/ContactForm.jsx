// ContactForm.jsx - Version améliorée
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, Loader, Send, MessageCircle, Phone, Mail } from 'lucide-react';

// Composant InputField avec animations améliorées
const InputField = ({ label, name, type = 'text', required = false, value, onChange }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-3"
  >
    <label className="text-sm font-semibold text-gray-700 flex items-center space-x-1">
      <span>{label}</span>
      {required && <span className="text-red-500 text-lg">*</span>}
    </label>
    {type === 'textarea' ? (
      <motion.textarea
        whileFocus={{ scale: 1.02 }}
        name={name}
        required={required}
        className="w-full px-4 py-4 rounded-2xl border-2 border-emerald-200 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 transition-all duration-300 h-32 text-sm shadow-sm hover:shadow-md focus:shadow-lg"
        placeholder={`Décrivez votre projet ou demande...`}
        value={value}
        onChange={onChange}
      />
    ) : (
      <motion.input
        whileFocus={{ scale: 1.02 }}
        type={type}
        name={name}
        required={required}
        className="w-full px-4 py-4 rounded-2xl border-2 border-emerald-200 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 transition-all duration-300 text-sm shadow-sm hover:shadow-md focus:shadow-lg"
        placeholder={`Votre ${label.toLowerCase()}...`}
        value={value}
        onChange={onChange}
      />
    )}
  </motion.div>
);

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const contactMethods = [
    {
      icon: Phone,
      title: 'Appelez-nous',
      description: '+237 6 96 96 10 11',
      action: 'tel:+237696961011'
    },
    {
      icon: Mail,
      title: 'Envoyez un email',
      description: 'contact@lebricoleur.cm',
      action: 'mailto:contact@lebricoleur.cm'
    },
    {
      icon: MessageCircle,
      title: 'Chat en direct',
      description: 'Support 24h/24',
      action: '#chat'
    }
  ];

  return (
    <motion.section
      id="contact-section"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="bg-gradient-to-br from-emerald-50 via-white to-green-50 py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* En-tête de section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.h2 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-green-700">
              Contactez-nous
            </span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            Une question ? Un projet ? Notre équipe est là pour vous accompagner sous 24 heures.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Méthodes de contact */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-1 space-y-6"
          >
            {contactMethods.map((method, index) => (
              <motion.a
                key={method.title}
                href={method.action}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, x: 10 }}
                className="flex items-center space-x-4 p-6 bg-white rounded-2xl border-2 border-emerald-100 hover:border-emerald-300 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="p-3 bg-emerald-100 rounded-xl group-hover:bg-emerald-500 transition-colors duration-300">
                  <method.icon className="w-6 h-6 text-emerald-600 group-hover:text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{method.title}</h3>
                  <p className="text-gray-600">{method.description}</p>
                </div>
              </motion.a>
            ))}
          </motion.div>

          {/* Formulaire de contact */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 border border-emerald-100">
              <AnimatePresence mode="wait">
                {submitStatus === 'success' ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-center p-8 space-y-6"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full"
                    >
                      <CheckCircle className="w-10 h-10 text-emerald-600" />
                    </motion.div>
                    <motion.h3 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-2xl font-bold text-gray-900"
                    >
                      Message envoyé avec succès !
                    </motion.h3>
                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-gray-600 text-lg"
                    >
                      Nous traitons votre demande et vous répondrons dans les plus brefs délais.
                    </motion.p>
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSubmitStatus('idle')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300"
                    >
                      Nouveau message
                    </motion.button>
                  </motion.div>
                ) : submitStatus === 'error' ? (
                  <motion.div 
                    key="error"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-center p-8 space-y-6"
                  >
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full">
                      <X className="w-10 h-10 text-red-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Erreur d'envoi
                    </h3>
                    <p className="text-gray-600 text-lg">
                      Veuillez réessayer ou nous contacter directement.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSubmitStatus('idle')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300"
                    >
                      Réessayer
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.form 
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit} 
                    className="space-y-8"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <InputField
                        label="Nom complet"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                      <InputField
                        label="Adresse email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                      <InputField
                        label="Numéro de téléphone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                      <InputField
                        label="Sujet"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                      />
                    </div>

                    <InputField
                      label="Votre message"
                      name="message"
                      type="textarea"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                    />

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center text-lg shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin mr-3" />
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-3" />
                          Envoyer le message
                        </>
                      )}
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default ContactForm;
// Footer.jsx - Version améliorée avec téléchargement d'application
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin,
  Download, Smartphone, AppWindow, Globe
} from 'lucide-react';
import logo from '../../assets/images2/bricoleur.png';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Services',
      links: ['Plomberie', 'Électricité', 'Menuiserie', 'Peinture', 'Nettoyage', 'Climatisation']
    },
    {
      title: 'Entreprise',
      links: ['À propos', 'Comment ça marche', 'Carrières', 'Presse', 'Blog', 'Partenariats']
    },
    {
      title: 'Support',
      links: ['Centre d\'aide', 'Contact', 'FAQ', 'Confidentialité', 'Conditions', 'Accessibilité']
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' }
  ];

  const appLinks = [
    {
      platform: 'App Store',
      icon: AppWindow,
      href: '#',
      bgColor: 'bg-gray-900 hover:bg-black',
      text: 'Disponible sur l\'App Store',
      subtext: 'Pour iPhone'
    },
    {
      platform: 'Play Store',
      icon: Smartphone,
      href: '#',
      bgColor: 'bg-emerald-600 hover:bg-emerald-700',
      text: 'Disponible sur Google Play',
      subtext: 'Pour Android'
    },
  ];

  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="bg-gradient-to-br from-emerald-900 via-green-900 to-emerald-950 text-gray-300 w-full"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Section principale */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-7 gap-12">
          {/* Brand Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="xl:col-span-2 space-y-6"
          >
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-14 h-14 from-emerald-500 rounded-2xl flex items-center justify-center"
              >
                <img 
                    src={logo}  
                    alt="Technicien professionnel à votre service" 
                    className="h-[400px] lg:h-[500px] xl:h-[600px] object-contain w-full drop-shadow-2xl "
                />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-white">Le Bricoleur</h2>
                <p className="text-emerald-300 text-sm">Votre partenaire de confiance</p>
              </div>
            </div>
            
            <p className="text-emerald-100 leading-relaxed max-w-md">
              Connecting people with trusted, nearby technicians for home repair services across Cameroon. 
              Quality work, guaranteed satisfaction.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-emerald-400" />
                <a href="tel:+237695521664" className="hover:text-white transition-colors">
                  +237 6 96 96 10 11
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-emerald-400" />
                <a href="mailto:contact@lebricoleur.cm" className="hover:text-white transition-colors">
                  contact@lebricoleur.cm
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-emerald-400" />
                <span>123 Bonamoussadi, Douala, Cameroon</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.2, y: -2 }}
                  className="w-10 h-10 bg-emerald-800 hover:bg-emerald-700 rounded-xl flex items-center justify-center transition-all duration-300 group"
                >
                  <social.icon className="w-5 h-5 text-emerald-300 group-hover:text-white" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Navigation Links */}
          {footerSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: sectionIndex * 0.1 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-white mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <motion.li
                    key={link}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (sectionIndex * 0.1) + (linkIndex * 0.05) }}
                  >
                    <Link 
                      to="#" 
                      className="text-emerald-200 hover:text-white transition-colors duration-300 hover:pl-2 block"
                    >
                      {link}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Téléchargement de l'application */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="xl:col-span-2 space-y-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-emerald-800 rounded-xl">
                <Download className="w-5 h-5 text-emerald-300" />
              </div>
              <h3 className="text-lg font-semibold text-white">Notre Application</h3>
            </div>
            
            <p className="text-emerald-200 text-sm mb-6">
              Téléchargez notre application pour une expérience optimale. Commandez en un clic, 
              suivez vos services en temps réel et profitez d'offres exclusives.
            </p>

            {/* Boutons de téléchargement */}
            <div className="space-y-3">
              {appLinks.map((app, index) => (
                <motion.a
                  key={app.platform}
                  href={app.href}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + (index * 0.1) }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className={`flex items-center space-x-3 ${app.bgColor} text-white p-3 rounded-xl transition-all duration-300 group`}
                >
                  <div className="p-2 bg-white/20 rounded-lg">
                    <app.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{app.text}</div>
                    <div className="text-xs opacity-90">{app.subtext}</div>
                  </div>
                  <Download className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.a>
              ))}
            </div>

          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="xl:col-span-2 space-y-4"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Newsletter</h3>
            <p className="text-emerald-200 text-sm mb-4">
              Restez informé des nouveaux services et promotions exclusives.
            </p>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Votre email"
                className="w-full px-4 py-3 bg-emerald-800 border border-emerald-700 rounded-xl text-white placeholder-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white py-3 rounded-xl font-semibold transition-all duration-300"
              >
                S'abonner
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-t border-emerald-800 mt-16 pt-8"
        >
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="text-emerald-300 text-sm">
              © {currentYear} Le Bricoleur. Tous droits réservés.
            </div>
            
            <div className="flex flex-wrap gap-6 justify-center text-sm">
              {['Mentions légales', 'Confidentialité', 'Cookies', 'CGU', 'Accessibilité'].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link 
                    to="#" 
                    className="text-emerald-300 hover:text-white transition-colors duration-300"
                  >
                    {item}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}
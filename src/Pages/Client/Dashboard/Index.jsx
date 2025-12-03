import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center px-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Icône d'erreur */}
      <div className="mb-8 relative">
        <div className="relative">
          <Home className="w-24 h-24 text-red-500 mx-auto" />
          <div className="absolute inset-0 bg-red-500 rounded-full opacity-10 blur-xl"></div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-md mx-auto">
        {/* Code d'erreur */}
        <h1 className="text-8xl font-bold text-red-500 mb-4 tracking-tighter">
          Acceuil
        </h1>
        
        {/* Titre */}
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Dashbord de l'application en cours de developpememt
        </h2>
        
        <div className="absolute top-1/3 left-1/4 w-12 h-12 bg-blue-200 dark:bg-blue-900 rounded-full opacity-20 blur-xl"></div>
      </div>
    </div>
  );
}